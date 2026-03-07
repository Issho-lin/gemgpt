export class CreateGeneralKnowledgeDto {
    name!: string;
    intro?: string;
    avatar?: string;
    vectorModel?: string;
    agentModel?: string;
    vlmModel?: string;
}

export class GetUploadPresignedDto {
    filename!: string;
    contentType?: string;
}

export class CreateDocumentDto {
    filename!: string;
    fileType!: string;
    objectKey!: string;
}
