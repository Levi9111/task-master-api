import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { QueryFilter, Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<void> {
    console.log('Create task');

    const newTask = new this.taskModel({
      ...createTaskDto,
      // If the frontend didn't specify an assignee, default to the user creating the task
      assigneeId: createTaskDto.assigneeId || userId,
    });

    console.log(newTask);

    await newTask.save();
  }

  async findAll(filterDto: FilterTaskDto) {
    const {
      status,
      priority,
      assigneeId,
      teamId,
      page = 1,
      limit = 10,
    } = filterDto;

    // Dynamically built the Mongoose query Object
    const query: QueryFilter<Task> = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assigneeId) query.assigneeId = assigneeId;
    if (teamId) query.teamId = teamId;

    // Calculate how many documents to skip for pagination
    const skip = (page - 1) * limit;

    // Run the data fetch and the total count concurrently for performance
    const [data, total] = await Promise.all([
      this.taskModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('assigneeId', 'name email')
        .exec(),
      this.taskModel.countDocuments(query).exec(),
    ]);

    // Return a strictly shaped paginated response

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();

    if (!task) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
    return task;
  }

  async update(id: string, updatedData: Partial<CreateTaskDto>): Promise<Task> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      },
    );

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID:${id} not found`);
    }
    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }
  }

  async addAttachment(
    taskId: string,
    file: Express.Multer.File,
  ): Promise<Task> {
    const task = await this.findOne(taskId);

    const { filename, originalname, mimetype, size, path } = file;

    // Creae Metadata object
    const attachmentMetadata = {
      filename,
      originalname,
      mimetype,
      size,
      path,
    };

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(
        taskId,
        { $push: { attachments: attachmentMetadata } },
        { returnDocument: 'after' }, // Return the updated document
      )
      .exec();

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return updatedTask;
  }
}
