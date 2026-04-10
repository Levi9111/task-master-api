import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-domment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async create(
    taskId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const newComment = new this.commentModel({
      content: createCommentDto.content,
      taskId,
      authorId: userId,
    });

    const savedComment = await newComment.save();
    return savedComment.populate('authorId', 'name email');
  }

  async findByTask(taskId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ taskId })
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 }) // newest comment at the top
      .exec();
  }
}
