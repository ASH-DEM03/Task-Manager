package com.Ash.tasks.mappers.impl;

import com.Ash.tasks.domain.entities.TaskList;
import com.Ash.tasks.repositories.TaskListRepository;
import com.Ash.tasks.services.TaskListService;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskListServiceImpl implements TaskListService {

    private final TaskListRepository taskListRepository;

    public TaskListServiceImpl(TaskListRepository taskListRepository) {
        this.taskListRepository = taskListRepository;
    }


    @Override
    public List<TaskList> listTaskLists() {
        return taskListRepository.findAll();
    }

    @Override
    public TaskList createTaskList(TaskList taskList) {

        if(null!=taskList.getId()){
            throw new IllegalArgumentException("Task list already exists");
        }

        if (null== taskList.getTitle()|| taskList.getTitle().isBlank()){
            throw new IllegalArgumentException("Task list title is required");
        }

        LocalDateTime now = LocalDateTime.now();
        return taskListRepository.save(new TaskList(
                null,
                taskList.getTitle(),
                taskList.getDescription(),
                null,
                now,
                now
                ));
    }

    @Override
    public Optional<TaskList> getTaskList(UUID id) {
        return taskListRepository.findById(id);
    }

    @Override
    public TaskList updateTaskList(UUID taskListId, TaskList taskList) {
        if(null==taskList.getId()){
            throw new IllegalArgumentException("Task list id is required");
        }

        if (!Objects.equals(taskList.getId(), taskListId)){
            throw new IllegalArgumentException("Task list id does not match");
        }

       TaskList existingTaskList = taskListRepository.findById(taskListId).
               orElseThrow(() -> new IllegalArgumentException("Task list id does not exist"));


        existingTaskList.setTitle(taskList.getTitle());
        existingTaskList.setDescription(taskList.getDescription());
        existingTaskList.setUpdated(LocalDateTime.now());
        return taskListRepository.save(existingTaskList);
    }

    @Override
    public void deleteTaskList(UUID taskListId) {
        taskListRepository.deleteById(taskListId);

    }

}
