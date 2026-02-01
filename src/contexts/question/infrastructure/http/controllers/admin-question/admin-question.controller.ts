import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { AdminAuth } from "@src/infrastructure/api/auth/providers/decorators/admin-auth/admin-auth.decorator";
import { SwaggerTags } from "@src/infrastructure/api/server/swagger/constants/swagger.enums";

import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";
import { MongoIdPipe } from "@shared/infrastructure/http/pipes/mongo/mongo-id/mongo-id.pipe";

import { createQuestionThemeAssignmentCreationCommandFromDto } from "@question/application/mappers/question-theme-assignment/question-theme-assignment-creation/question-theme-assignment-creation.dto.mappers";
import { QuestionThemeAssignmentCreationDto } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto";
import { AssignThemeToQuestionUseCase } from "@question/application/use-cases/question-theme-assignment/assign-theme-to-question/assign-theme-to-question.use-case";
import { ArchiveQuestionUseCase } from "@question/application/use-cases/archive-question/archive-question.use-case";
import { createQuestionCreationCommandFromDto } from "@question/application/mappers/question-creation/question-creation.dto.mappers";
import { CreateQuestionUseCase } from "@question/application/use-cases/create-question/create-question.use-case";
import { QuestionCreationDto } from "@question/application/dto/question-creation/question-creation.dto";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto";
import { createAdminQuestionDtoFromEntity } from "@question/application/mappers/question/question.dto.mappers";
import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";

@AdminAuth()
@Controller(`${ControllerPrefixes.ADMIN}/${ControllerPrefixes.QUESTIONS}`)
export class AdminQuestionController {
  public constructor(
    private readonly findQuestionsUseCase: FindQuestionsUseCase,
    private readonly findQuestionByIdUseCase: FindQuestionByIdUseCase,
    private readonly createQuestionUseCase: CreateQuestionUseCase,
    private readonly archiveQuestionUseCase: ArchiveQuestionUseCase,
    private readonly assignThemeToQuestionUseCase: AssignThemeToQuestionUseCase,
  ) {}

  @Get()
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTIONS,
    ],
    summary: "Get all questions for backend administration",
    description: "Get the list of all questions available in the database with detailed structure for backend administration.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: [AdminQuestionDto],
  })
  public async findQuestions(): Promise<AdminQuestionDto[]> {
    const questions = await this.findQuestionsUseCase.list();

    return questions.map(question => createAdminQuestionDtoFromEntity(question));
  }

  @Get("/:id")
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTIONS,
    ],
    summary: "Get question by ID for backend administration",
    description: "Get a specific question by its unique identifier with detailed structure for backend administration.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: AdminQuestionDto,
  })
  public async findQuestionById(@Param("id", MongoIdPipe) id: string): Promise<AdminQuestionDto> {
    const question = await this.findQuestionByIdUseCase.getById(id);

    return createAdminQuestionDtoFromEntity(question);
  }

  @Post()
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTIONS,
    ],
    summary: "Create a new question for backend administration",
    description: "Create a new question in the database with the provided details for backend administration.",
  })
  @ZodResponse({
    status: HttpStatus.CREATED,
    type: AdminQuestionDto,
  })
  public async createQuestion(@Body() questionCreationDto: QuestionCreationDto): Promise<AdminQuestionDto> {
    const questionCreationCommand = createQuestionCreationCommandFromDto(questionCreationDto);
    const question = await this.createQuestionUseCase.create(questionCreationCommand);

    return createAdminQuestionDtoFromEntity(question);
  }

  @Post("/:id/archive")
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTIONS,
    ],
    summary: "Archive a question",
    description: `Archive a specific question by its unique identifier. Returns the archived question with detailed structure for backend administration. An already archived question cannot be archived again.`,
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: AdminQuestionDto,
  })
  public async archiveQuestion(@Param("id", MongoIdPipe) id: string): Promise<AdminQuestionDto> {
    const archivedQuestion = await this.archiveQuestionUseCase.archive(id);

    return createAdminQuestionDtoFromEntity(archivedQuestion);
  }

  @Post("/:id/themes")
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTIONS,
    ],
    summary: "Assign a theme to a question",
    description: `Assign a specific theme to a question by its unique identifier. Returns the updated question with detailed structure for backend administration.`,
  })
  @ZodResponse({
    status: HttpStatus.CREATED,
    type: AdminQuestionDto,
  })
  public async assignThemeToQuestion(
    @Param("id", MongoIdPipe) id: string,
    @Body() questionThemeAssignmentCreationDto: QuestionThemeAssignmentCreationDto,
  ): Promise<AdminQuestionDto> {
    const questionThemeAssignmentCreationCommand = createQuestionThemeAssignmentCreationCommandFromDto(id, questionThemeAssignmentCreationDto);
    const updatedQuestion = await this.assignThemeToQuestionUseCase.assign(questionThemeAssignmentCreationCommand);

    return createAdminQuestionDtoFromEntity(updatedQuestion);
  }
}