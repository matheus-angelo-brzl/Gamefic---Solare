import { Module } from '@nestjs/common';
import { PrismaModule } from '@common/prisma/prisma.module';
import { StorageModule } from '@common/storage/storage.module';
import { ValidationModule } from '@common/validation/validation.module';
import { JwtModule } from '@common/jwt/jwt.module';
import { AccessModule } from '@common/access/access.module';
import { HealthModule } from '@modules/health/health.module';
import { AuthModule } from '@modules/auth/auth.module';
import { EditionsModule } from '@modules/editions/editions.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { TasksModule } from '@modules/tasks/tasks.module';
import { SubmissionsModule } from '@modules/submissions/submissions.module';
import { MetricsModule } from '@modules/metrics/metrics.module';
import { RankingModule } from '@modules/ranking/ranking.module';
import { CompetitionModule } from '@modules/competition/competition.module';

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    ValidationModule,
    JwtModule,
    AccessModule,
    HealthModule,
    AuthModule,
    EditionsModule,
    CategoriesModule,
    TasksModule,
    SubmissionsModule,
    MetricsModule,
    RankingModule,
    CompetitionModule,
  ],
})
export class AppModule {}
