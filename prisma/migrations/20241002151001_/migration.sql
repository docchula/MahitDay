-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `team_code` INTEGER NOT NULL,
    `teacher_prefix` VARCHAR(191) NOT NULL,
    `teacher_firstname` VARCHAR(191) NOT NULL,
    `teacher_lastname` VARCHAR(191) NOT NULL,
    `teacher_phone` VARCHAR(191) NOT NULL,
    `all_join_medtalk` INTEGER NOT NULL,
    `total_payment` INTEGER NOT NULL,
    `enrollment_status` INTEGER NOT NULL,
    `team_reference` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `teams_team_reference_key`(`team_reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `team_reference` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NULL,
    `national_id` VARCHAR(191) NULL,
    `prefix` VARCHAR(191) NULL,
    `firstname` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `grade` INTEGER NULL,
    `is_join_medtalk` BOOLEAN NULL,
    `preferred_hand` VARCHAR(191) NULL,
    `student_reference` VARCHAR(191) NOT NULL,
    `student_score` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `students_student_reference_key`(`student_reference`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `school` VARCHAR(191) NOT NULL,
    `school_location` VARCHAR(191) NOT NULL,
    `school_phone_number` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NULL,
    `agree_to_terms` BOOLEAN NOT NULL,
    `downloaded` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_email_fkey` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_team_reference_fkey` FOREIGN KEY (`team_reference`) REFERENCES `teams`(`team_reference`) ON DELETE RESTRICT ON UPDATE CASCADE;
