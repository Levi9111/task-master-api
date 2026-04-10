import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { CreateCommentDto } from './dto/create-domment.dto';

@Controller('tasks/:taskId/comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post()
  async create(
    @Param('taskId', ParseObjectIdPipe) taskId: string, // Extract and validate the Task ID from the URL
    @Request() req, // Get the user from JWT
    @Body() CreateCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(
      taskId,
      req.user.userId,
      CreateCommentDto,
    );
  }

  @Get()
  async findAllByTask(@Param('taskId', ParseObjectIdPipe) taskId: string) {
    return this.commentService.findByTask(taskId);
  }
}
