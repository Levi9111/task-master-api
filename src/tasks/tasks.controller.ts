import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { FilterTaskDto } from './dto/filter-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.config';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    // We pass the currently logged-in user's ID to the service
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  async findAll(@Query() filterDto: FilterTaskDto) {
    // @Query() automatically extracts and validates the query string using our DTO
    return this.tasksService.findAll(filterDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    // The ParseObjectIdPipe runs FIRST. If it fails, the code inside this method never runs.
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateData: Partial<CreateTaskDto>,
  ) {
    return this.tasksService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param(':id', ParseObjectIdPipe) id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/attachments')
  // 1. Intercept the request, look for a field named 'file', and apply our multer config
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadAttachment(
    @Param('id', ParseObjectIdPipe) id: string,
    // 2. Extract the processed file from the request using the decorator
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // 3. Pass the file data to the service
    return this.tasksService.addAttachment(id, file);
  }
}
