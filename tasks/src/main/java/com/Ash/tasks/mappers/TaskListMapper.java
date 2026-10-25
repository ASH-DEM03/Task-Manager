package com.Ash.tasks.mappers;

import com.Ash.tasks.domain.dto.TaskListDto;
import com.Ash.tasks.domain.entities.TaskList;

public interface TaskListMapper {
    TaskList fromDto(TaskListDto taskListDto);
    TaskListDto toDto(TaskList taskList);
}
