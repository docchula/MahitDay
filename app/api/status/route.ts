import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import { prisma } from '../base';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) {
    let team_count = 0;
    let agree_to_terms = false;
    let school = false;
    let all_team_is_ready = true;
    let team_count_bol = false;

    const user = await prisma.users.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    const team = await prisma.teams.findMany({
      where: {
        email: session.user?.email as string,
      },
    });

    if (team) {
      team_count = team.length;
      if (team.length > 0) {
        team_count_bol = true;
      }
    }

    // all_team_is_ready calculation
    for (let i = 0; i < team.length; i += 1) {
      if (team[i].enrollment_status === 3 || team[i].enrollment_status === 0) {
        all_team_is_ready = false;
        break;
      }
    }

    if (team_count === 0) {
      all_team_is_ready = false;
    }

    if (user) {
      agree_to_terms = true;
      if (user.school && user.school_location && user.school_phone_number) {
        school = true;
      }
    }

    return NextResponse.json({
      agree_to_terms,
      school,
      team_count,
      team_count_bol,
      all_team_is_ready,
    });
  }
  /*
  agree_to_terms = step1
  school = step2
  team_count_bol for step 3
  all_team_is_ready for step 4

  team_count = how many team has been enrolled
  enrollment_status
    0 : some team is not verified
    1 : all team is verified
    (from product of all team enrollment_status)
  */
  return NextResponse.json({ status: 'Please log in' });
}
