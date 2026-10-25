package com.Ash.tasks.controllers;


import com.Ash.tasks.domain.dto.TaskListDto;
import com.Ash.tasks.domain.entities.TaskList;
import com.Ash.tasks.mappers.TaskListMapper;
import com.Ash.tasks.mappers.impl.TaskListMapperImpl;
import com.Ash.tasks.repositories.TaskListRepository;
import com.Ash.tasks.services.TaskListService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path ="/api/task-lists")
public class TaskListController {

    private TaskListService taskListService;
    private TaskListMapper taskListMapper;

    public TaskListController(TaskListService taskListService, TaskListMapper taskListMapper) {
        this.taskListService = taskListService;
        this.taskListMapper = taskListMapper;
    }


    @GetMapping
    public List<TaskListDto> listTaskLists() {

       return  taskListService.listTaskLists().stream().map(taskListMapper::toDto)
                .toList();
    }

    @PostMapping
    public TaskListDto createTaskList(@RequestBody TaskListDto taskListDto) {

        TaskList createdTaskList = taskListService.createTaskList(
                taskListMapper.fromDto(taskListDto)
        );
        return taskListMapper.toDto(createdTaskList);
    }

    @GetMapping(path = "/{task_list_id}")
    public Optional<TaskListDto> getTaskListById(
            @PathVariable("task_list_id") UUID taskListId) {

        return taskListService.getTaskList(taskListId).map(taskListMapper::toDto);
    }

    @PutMapping(path ="/{task_list_id}")
            public TaskListDto updateTaskList(
                    @PathVariable("task_list_id") UUID taskListId,
                    @RequestBody TaskListDto taskListDto
    ){

       TaskList updatedTaskList = taskListService.updateTaskList(taskListId, taskListMapper.fromDto(taskListDto));

        return taskListMapper.toDto(updatedTaskList);

    }

    @DeleteMapping(path = "/{task_list_id}")
    public void deleteTaskList(@PathVariable("task_list_id") UUID taskListId) {
        taskListService.deleteTaskList(taskListId);
    }
}
