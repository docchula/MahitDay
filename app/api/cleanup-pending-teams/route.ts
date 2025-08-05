import { NextResponse } from 'next/server';
import { prisma } from '../base';

export async function GET() {
  try {
    // Calculate the cutoff time (40 minutes ago)
    const cutoffTime = new Date(Date.now() - 40 * 60 * 1000); // 40 minutes in milliseconds

    // Find teams with enrollment_status = 0 that are older than 40 minutes
    const pendingTeams = await prisma.teams.findMany({
      where: {
        enrollment_status: 0,
        created_at: {
          lt: cutoffTime,
        },
      },
      include: {
        student: true,
      },
    });

    let deletedCount = 0;

    for (const team of pendingTeams) {
      try {
        // Delete students first (due to foreign key constraint)
        await prisma.students.deleteMany({
          where: {
            team_reference: team.team_reference,
          },
        });

        // Delete the team
        const deletedTeam = await prisma.teams.deleteMany({
          where: {
            team_reference: team.team_reference,
          },
        });

        if (deletedTeam.count > 0) {
          deletedCount += 1;
        }
      } catch (error) {
        // Error handling for individual team deletion
      }
    }

    return NextResponse.json({
      status: 'success',
      message: `Deleted ${deletedCount} pending teams older than 40 minutes`,
      deletedCount,
      totalFound: pendingTeams.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to cleanup pending teams',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
