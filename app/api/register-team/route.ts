import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { createId } from '@paralleldrive/cuid2';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import { prisma } from '../base';
import { MAX_TEAM } from '../../../utils/config';
import { writeFile } from '@/utils/file';

function generateRandomStudentId() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// get all MedTalk people enroll from this account

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) {
    const team = await prisma.teams.findMany({
      where: {
        email: session.user?.email as string,
      },
    });

    if (team.length > 0) {
      const return_teams: any[] = team;
      await Promise.all(
        return_teams.map(async (obj) => {
          const student = await prisma.students.findMany({
            where: {
              team_reference: obj.team_reference,
            },
            orderBy: {
              student_reference: 'asc',
            },
          });

          if (student.length === 2) {
            const student1_national_id = student[0].national_id;
            const student1_student_id = student[0].student_id;

            const student2_national_id = student[1].national_id;
            const student2_student_id = student[1].student_id;

            const student_1_obj = {
              ...student[0],
              national_id: student1_national_id,
              student_id: student1_student_id,
            };

            const student_2_obj = {
              ...student[1],
              national_id: student2_national_id,
              student_id: student2_student_id,
            };

            const updatedObj = { ...obj }; // Create a new object with the same properties as 'obj'
            updatedObj.student_1 = student_1_obj;
            updatedObj.student_2 = student_2_obj;
            return_teams[return_teams.indexOf(obj)] = updatedObj;
          }
          return NextResponse.json({ status: 'students not found' });
        })
      );
      return NextResponse.json(return_teams);
    }
    return NextResponse.json({ status: 'no team registered found' });
  }
}

// don't forget to add try/catch in creating new team and student

export async function POST(req: NextRequest) {
  let school = false;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ status: 'Please log in' });

  const teamCount = await prisma.teams.count({
    where: {
      enrollment_status: {
        in: [1, 2, 3],
      },
    },
  });
  if (teamCount >= MAX_TEAM) {
    return NextResponse.json({ status: 'registration is closed' });
  }

  const user = await prisma.users.findUnique({
    where: {
      email: session.user?.email as string,
    },
  });
  if (user) {
    if (user.school && user.school_location && user.school_phone_number) {
      school = true;
    }
    if (school === false) {
      return NextResponse.json({ school, status: 'please complete your school information' });
    }
    const data = await req.formData();

    // console.log(data);

    const randomRef = createId();

    const payload = data.get('payload') as string;

    const student_1_image = data.get('student_1_image') as File;
    const student_2_image = data.get('student_2_image') as File;

    const student_1_id = data.get('student_1_id') as File;
    const student_2_id = data.get('student_2_id') as File;

    const request = JSON.parse(payload);

    const name = request.name ? request.name : '';
    const teacherPrefix = request.teacher_prefix ? request.teacher_prefix : '';
    const teacherFirstname = request.teacher_firstname ? request.teacher_firstname : '';
    const teacherLastname = request.teacher_lastname ? request.teacher_lastname : '';
    const teacherPhone = request.teacher_phone ? request.teacher_phone : '';
    const randomTeamcode = Math.floor(1000 + Math.random() * 9000);

    const student1Ref = `1_${randomRef}`;
    const student1Id = request.student_1_id_number ? request.student_1_id_number : '';
    const student1Prefix = request.student_1_prefix ? request.student_1_prefix : '';
    const student1Firstname = request.student_1_firstname ? request.student_1_firstname : '';
    const student1Lastname = request.student_1_lastname ? request.student_1_lastname : '';
    const student1Email = request.student_1_email ? request.student_1_email : '';
    const student1Phone = request.student_1_phone ? request.student_1_phone : '';
    const student1Grade = request.student_1_grade ? request.student_1_grade : 0;
    const student1JoinMedtalk = request.student_1_join_medtalk
      ? request.student_1_join_medtalk
      : false;
    const student1PreferredHand = request.student_1_preferred_hand
      ? request.student_1_preferred_hand
      : 'right';

    const student2Ref = `2_${randomRef}`;
    const student2Id = request.student_2_id_number ? request.student_2_id_number : '';
    const student2Prefix = request.student_2_prefix ? request.student_2_prefix : '';
    const student2Firstname = request.student_2_firstname ? request.student_2_firstname : '';
    const student2Lastname = request.student_2_lastname ? request.student_2_lastname : '';
    const student2Email = request.student_2_email ? request.student_2_email : '';
    const student2Phone = request.student_2_phone ? request.student_2_phone : '';
    const student2Grade = request.student_2_grade ? request.student_2_grade : 0;
    const student2JoinMedtalk = request.student_2_join_medtalk
      ? request.student_2_join_medtalk
      : false;
    const student2PreferredHand = request.student_2_preferred_hand
      ? request.student_2_preferred_hand
      : 'right';

    let all_join_medtalk = 0;
    if (student1JoinMedtalk) {
      all_join_medtalk += 1;
    }
    if (student2JoinMedtalk) {
      all_join_medtalk += 1;
    }
    let total_payment;
    if (all_join_medtalk === 0) {
      total_payment = 600;
    } else {
      total_payment = 750;
    }

    const student1RandomId = generateRandomStudentId();
    const student2RandomId = generateRandomStudentId();

    try {
      await prisma.teams.create({
        data: {
          email: session.user?.email as string,
          name,
          team_code: randomTeamcode as number,
          teacher_prefix: teacherPrefix as string,
          teacher_firstname: teacherFirstname as string,
          teacher_lastname: teacherLastname as string,
          teacher_phone: teacherPhone as string,
          all_join_medtalk,
          total_payment: total_payment as number,
          enrollment_status: 0,
          team_reference: randomRef,
        },
      });

      await prisma.students.create({
        data: {
          team_reference: randomRef,
          student_id: student1RandomId,
          national_id: student1Id as string,
          prefix: student1Prefix as string,
          firstname: student1Firstname as string,
          lastname: student1Lastname as string,
          email: student1Email as string,
          phone_number: student1Phone as string,
          grade: student1Grade as number,
          is_join_medtalk: student1JoinMedtalk,
          preferred_hand: student1PreferredHand as string,
          student_reference: student1Ref,
          medtour_group: request.student_1_medtour_group,
          medtour_flex: 'no',
        },
      });

      await prisma.students.create({
        data: {
          team_reference: randomRef,
          student_id: student2RandomId,
          national_id: student2Id as string,
          prefix: student2Prefix as string,
          firstname: student2Firstname as string,
          lastname: student2Lastname as string,
          email: student2Email as string,
          phone_number: student2Phone as string,
          grade: student2Grade as number,
          is_join_medtalk: student2JoinMedtalk,
          preferred_hand: student2PreferredHand as string,
          student_reference: student2Ref,
          medtour_group: request.student_2_medtour_group,
          medtour_flex: 'no',
        },
      });

      const tasks: Promise<void>[] = [];

      if (student_1_image) {
        tasks.push(writeFile(`images/${student1Ref}`, await student_1_image.bytes()));
      }
      if (student_1_id) {
        tasks.push(writeFile(`cards/${student1Ref}`, await student_1_id.bytes()));
      }
      if (student_2_image) {
        tasks.push(writeFile(`images/${student2Ref}`, await student_2_image.bytes()));
      }
      if (student_2_id) {
        tasks.push(writeFile(`cards/${student2Ref}`, await student_2_id.bytes()));
      }

      await Promise.all(tasks);

      return NextResponse.json({ status: 'ok' });
    } catch (error) {
      return NextResponse.json({ status: 'error please try again', error });
    }
  } else {
    return NextResponse.json({ status: 'user not found' });
  }
}

// PUT and DELETE left to do

// add team_reference, random_team_code, student_1_reference, student_2_reference to the payload
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    const user = await prisma.users.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });
    if (user) {
      const data = await req.formData();

      // console.log(data);

      const payload = data.get('payload') as string;

      const student_1_image = data.get('student_1_image') as File;
      const student_2_image = data.get('student_2_image') as File;

      const student_1_id = data.get('student_1_id') as File;
      const student_2_id = data.get('student_2_id') as File;

      const request = JSON.parse(payload);

      const name = request.name ? request.name : '';
      const teacherPrefix = request.teacher_prefix ? request.teacher_prefix : '';
      const teacherFirstname = request.teacher_firstname ? request.teacher_firstname : '';
      const teacherLastname = request.teacher_lastname ? request.teacher_lastname : '';
      const teacherPhone = request.teacher_phone ? request.teacher_phone : '';
      const team_reference = request.team_reference ? request.team_reference : '';

      const student1Ref = request.student_1_reference ? request.student_1_reference : '';
      const student1Id = request.student_1_id_number ? request.student_1_id_number : '';
      const student1Prefix = request.student_1_prefix ? request.student_1_prefix : '';
      const student1Firstname = request.student_1_firstname ? request.student_1_firstname : '';
      const student1Lastname = request.student_1_lastname ? request.student_1_lastname : '';
      const student1Email = request.student_1_email ? request.student_1_email : '';
      const student1Phone = request.student_1_phone ? request.student_1_phone : '';
      const student1Grade = request.student_1_grade ? request.student_1_grade : 0;
      const student1JoinMedtalk = request.student_1_join_medtalk
        ? request.student_1_join_medtalk
        : false;
      const student1PreferredHand = request.student_1_preferred_hand
        ? request.student_1_preferred_hand
        : 'right';

      const student2Ref = request.student_2_reference ? request.student_2_reference : '';
      const student2Id = request.student_2_id_number ? request.student_2_id_number : '';
      const student2Prefix = request.student_2_prefix ? request.student_2_prefix : '';
      const student2Firstname = request.student_2_firstname ? request.student_2_firstname : '';
      const student2Lastname = request.student_2_lastname ? request.student_2_lastname : '';
      const student2Email = request.student_2_email ? request.student_2_email : '';
      const student2Phone = request.student_2_phone ? request.student_2_phone : '';
      const student2Grade = request.student_2_grade ? request.student_2_grade : 0;
      const student2JoinMedtalk = request.student_2_join_medtalk
        ? request.student_2_join_medtalk
        : false;
      const student2PreferredHand = request.student_2_preferred_hand
        ? request.student_2_preferred_hand
        : 'right';

      let all_join_medtalk = 0;

      if (student1JoinMedtalk) {
        all_join_medtalk += 1;
      }
      if (student2JoinMedtalk) {
        all_join_medtalk += 1;
      }

      let total_payment;
      if (all_join_medtalk === 0) {
        total_payment = 600;
      } else {
        total_payment = 750;
      }

      try {
        await prisma.teams.updateMany({
          where: {
            team_reference,
            email: session.user?.email as string,
            enrollment_status: 0 as number,
          },
          data: {
            name,
            teacher_prefix: teacherPrefix as string,
            teacher_firstname: teacherFirstname as string,
            teacher_lastname: teacherLastname as string,
            teacher_phone: teacherPhone as string,
            all_join_medtalk,
            total_payment: total_payment as number,
            enrollment_status: 0,
          },
        });

        const findTeam = await prisma.teams.findMany({
          where: {
            team_reference,
            email: session.user?.email as string,
          },
        });

        // console.log('findteam' + findTeam.length)

        if (findTeam.length === 0) {
          return NextResponse.json({ status: 'Editable team not found' });
        }

        const updateStudent1 = await prisma.students.updateMany({
          where: {
            student_reference: student1Ref,
            team_reference,
          },
          data: {
            national_id: student1Id as string,
            prefix: student1Prefix as string,
            firstname: student1Firstname as string,
            lastname: student1Lastname as string,
            email: student1Email as string,
            phone_number: student1Phone as string,
            grade: student1Grade as number,
            is_join_medtalk: student1JoinMedtalk as boolean,
            medtour_group: request.student_1_medtour_group,
            medtour_flex: 'no',
            preferred_hand: student1PreferredHand as string,
            student_reference: student1Ref,
          },
        });

        const updateStudent2 = await prisma.students.updateMany({
          where: {
            student_reference: student2Ref,
          },
          data: {
            national_id: student2Id as string,
            prefix: student2Prefix as string,
            firstname: student2Firstname as string,
            lastname: student2Lastname as string,
            email: student2Email as string,
            phone_number: student2Phone as string,
            grade: student2Grade as number,
            is_join_medtalk: student2JoinMedtalk as boolean,
            medtour_group: request.student_2_medtour_group,
            medtour_flex: 'no',
            preferred_hand: student2PreferredHand as string,
            student_reference: student2Ref,
          },
        });
        // console.log(updateStudent1, updateStudent2)

        if (updateStudent1.count === 0 || updateStudent2.count === 0) {
          return NextResponse.json({ status: 'student not found' });
        }

        const tasks: Promise<void>[] = [];

        if (student_1_image) {
          tasks.push(writeFile(`images/${student1Ref}`, await student_1_image.bytes()));
        }
        if (student_1_id) {
          tasks.push(writeFile(`cards/${student1Ref}`, await student_1_id.bytes()));
        }
        if (student_2_image) {
          tasks.push(writeFile(`images/${student2Ref}`, await student_2_image.bytes()));
        }
        if (student_2_id) {
          tasks.push(writeFile(`cards/${student2Ref}`, await student_2_id.bytes()));
        }

        await Promise.all(tasks);

        return NextResponse.json({ status: 'ok' });
      } catch (error) {
        return NextResponse.json({ status: 'error please try again', error });
      }
    } else {
      return NextResponse.json({ status: 'user not found' });
    }
  }

  return NextResponse.json({ status: 'Please log in' });
}

/*
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const data = await req.body();
  const team_reference = data.team_reference ? data.team_reference : '';
  if (session) {
    if (team_reference) {
      const team = await prisma.teams.findMany({
        where: {
          email: session.user?.email as string,
          team_reference,
        },
      });
      if (team.length === 0) {
        null;
      }
      console.log(team);
    }
    return NextResponse.json({ status: 'ok', data });
  }
  return NextResponse.json({ status: 'Please log in' });
}

export async function DELETE() {
  return NextResponse.json({ status: 'ok' });
}
*/

export async function DELETE(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const teamRef = url.searchParams.get('teamRef');
  const method = url.searchParams.get('method');
  console.log('Delete teamRef:', teamRef);
  console.log('method', method);

  //1. check sign in
  //2. check that teamRef is valid and email of team(teamRef) is the same as logged in email
  //3. check that status of team is 0
  //4. delete student
  //5. delete team
  //6. delete student's image

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ status: 'Please log in' });

  const team = await prisma.teams.findMany({
    where: {
      email: session.user?.email as string,
      team_reference: teamRef as string,
    },
  });

  if (team.length === 0) {
    return NextResponse.json({ status: 'team not found' });
  }
  if (team.length === 1) {
    console.log('Team enrollment_status:', team[0].enrollment_status);
    if (
      team[0].enrollment_status === 0 ||
      team[0].enrollment_status === 1 ||
      team[0].enrollment_status === 2
    ) {
      // delete student and team
      const deleteStudent = await prisma.students.deleteMany({
        where: {
          team_reference: teamRef as string,
        },
      });

      const deleteTeam = await prisma.teams.deleteMany({
        where: {
          team_reference: teamRef as string,
        },
      });

      if (deleteStudent.count === 0 || deleteTeam.count === 0) {
        return NextResponse.json({ status: 'delete failed' });
      }
      // delete image
      return NextResponse.json({ status: 'ok' });
    }
    return NextResponse.json({
      status: `unable to delete this team - enrollment status: ${team[0].enrollment_status}`,
    });
  }
  return NextResponse.json({ status: 'ok' });
}
// delete image from firebase left
