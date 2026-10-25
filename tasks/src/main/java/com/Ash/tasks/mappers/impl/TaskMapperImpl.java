package com.Ash.tasks.mappers.impl;

import com.Ash.tasks.domain.dto.TaskDto;
import com.Ash.tasks.domain.entities.Task;
import com.Ash.tasks.mappers.TaskMapper;
import org.springframework.stereotype.Component;

import java.util.UUID;
@Component
public class TaskMapperImpl implements TaskMapper {

    @Override
    public Task fromDto(TaskDto taskDto) {
        return new Task(
                taskDto.id(),
                taskDto.title(),
                taskDto.description(),
                taskDto.dueDate(),
                taskDto.status(),
                taskDto.priority(),
                null,
                null,
                null
        );
    }

    @Override
    public TaskDto toDto(Task task) {
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus()
        );
    }
}
