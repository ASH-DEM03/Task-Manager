package com.Ash.tasks.mappers;

import com.Ash.tasks.domain.dto.TaskDto;
import com.Ash.tasks.domain.entities.Task;

public interface TaskMapper {
    Task fromDto(TaskDto taskDto);
    TaskDto toDto(Task task);
}
