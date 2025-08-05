import { Button, Center, Table } from '@mantine/core';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { MAX_Gross_anatomy, MAX_Histology } from '../../utils/config';

interface IVerifyData {
  team: Array<{
    name: string;
    email: string;
    team_code: string;
    team_reference: string;
    total_payment: number;
  }>;
  transformedStudents: Array<{
    prefix: string;
    firstname: string;
    lastname: string;
    grade: string;
    national_id: string;
    student_reference: string;
    is_join_medtalk: boolean;
    medtour_group?: string;
    medtour_flex?: string;
    student_id: string;
  }>;
  image_1: string;
  imageCard_1: string;
  image_2: string;
  imageCard_2: string;
  base64Slip: string;
  verifiedCounts?: {
    gross: number;
    histology: number;
  };
}

const otherGroup = (group: string) => (group === 'Histology' ? 'Gross anatomy' : 'Histology');

async function getGroupCapacity(group: string) {
  const res = await fetch(`/api/check-medtour-capacity?group=${encodeURIComponent(group)}`);
  if (res.ok) {
    return res.json();
  }
  return { total12: 0, total2: 0, max: 0 };
}

export default function Verification() {
  const [data, setData] = useState<IVerifyData | null>(null);
  const [counter, setCounter] = useState({ team: -1 });
  const [groupCapacities, setGroupCapacities] = useState<any>({});
  const [pendingTeamsCount, setPendingTeamsCount] = useState(0);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const handleAccept = () => sendRequest(true);
  const handleReject = () => sendRequest(false);

  const handleCleanup = async () => {
    if (
      !window.confirm('Are you sure you want to delete all pending teams older than 40 minutes?')
    ) {
      return;
    }

    setIsCleaningUp(true);
    try {
      const response = await fetch('/api/cleanup-pending-teams');
      const cleanupData = await response.json();
      alert(`Cleanup result: ${cleanupData.message}`);
      // Refresh the page to update counts
      window.location.reload();
    } catch (error) {
      alert(`Error running cleanup: ${error}`);
    } finally {
      setIsCleaningUp(false);
    }
  };

  const fetchPendingTeamsCount = async () => {
    try {
      const cutoffTime = new Date(Date.now() - 40 * 60 * 1000);
      const response = await fetch(
        `/api/admin/teams?status=0&olderThan=${cutoffTime.toISOString()}`
      );
      if (response.ok) {
        const countData = await response.json();
        setPendingTeamsCount(countData.count || 0);
      }
    } catch (error) {
      console.error('Error fetching pending teams count:', error);
    }
  };

  const sendRequest = async (acceptance: boolean) => {
    if (!data) return;
    try {
      const response = await fetch('/api/admin/update-verification', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_reference: data.team[0].team_reference,
          acceptance,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert(JSON.stringify(responseData));
        fetchData();
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/verification');
      if (response.ok) {
        const jsonData: IVerifyData = await response.json();
        setData(jsonData);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCounter = async () => {
    try {
      const response = await fetch('/api/admin/team-count');
      const jsonData = await response.json();
      setCounter(jsonData);
    } catch (error) {
      console.error('Error counting remaining teams');
    }
  };

  useEffect(() => {
    fetchData();
    fetchCounter();
    fetchPendingTeamsCount();
  }, []);

  useEffect(() => {
    if (data && data.transformedStudents) {
      (async () => {
        const caps: any = {};
        for (const student of data.transformedStudents) {
          if (student.medtour_group) {
            caps[student.medtour_group] = await getGroupCapacity(student.medtour_group);
            caps[otherGroup(student.medtour_group)] = await getGroupCapacity(
              otherGroup(student.medtour_group)
            );
          }
        }
        setGroupCapacities(caps);
      })();
    }
  }, [data]);

  if (!data) return <div>Loading...</div>;

  if (data.team && Array.isArray(data.team) && data.team.length > 0) {
    const team = data.team[0];
    const counterShow = counter.team;
    const grossCount = data.verifiedCounts?.gross ?? 0;
    const histologyCount = data.verifiedCounts?.histology ?? 0;

    return (
      <AdminLayout>
        <Center>
          <div>
            <p>Remaining: {counterShow} team(s)</p>
            <p>
              Verified students: Gross anatomy = {grossCount} / {MAX_Gross_anatomy}, Histology ={' '}
              {histologyCount} / {MAX_Histology}
            </p>
            <p>
              Remaining team(s) including this team || showing -1 meaning error in getting remaining
              teams
            </p>
            <p>Pending teams older than 40 minutes: {pendingTeamsCount}</p>
            <Button
              type="button"
              color="red"
              onClick={handleCleanup}
              disabled={isCleaningUp}
              style={{ marginBottom: '20px' }}
            >
              {isCleaningUp ? 'Cleaning up...' : 'Delete Pending Teams (>40min)'}
            </Button>
            <hr />
            <h1>Team Info</h1>
            <p>Name: {team.name}</p>
            <p>Email: {team.email}</p>
            <p>Team Code: {team.team_code}</p>
            <p>Team Reference: {team.team_reference}</p>
            <p>Total Payment: {team.total_payment}</p>

            <h2>Students</h2>
            <Table>
              <thead>
                <tr>
                  <th>Student Image</th>
                  <th>ID Card Image</th>
                  <th>ชื่อ</th>
                  <th>นามสกุล</th>
                  <th>รหัสนักเรียน</th>
                  <th>ระดับชั้น</th>
                  <th>เลขบัตรประชาชน</th>
                  <th>is_join_medtalk</th>
                  <th>medtour_group</th>
                  <th>Medtour Action</th>
                </tr>
              </thead>
              <tbody>
                {data.transformedStudents.map((student, idx) => {
                  let warning = '';
                  let acceptanceMessage = '';

                  if (student.is_join_medtalk && student.medtour_group) {
                    const cap = groupCapacities[student.medtour_group];
                    const otherCap = groupCapacities[otherGroup(student.medtour_group)];

                    // Only run warning logic if we have valid capacity data
                    if (cap && cap.total2 !== undefined && cap.max !== undefined) {
                      if (cap.total2 >= cap.max) {
                        if (
                          student.medtour_flex === 'yes' &&
                          otherCap &&
                          otherCap.total2 < otherCap.max
                        ) {
                          warning = '🟡 ผู้สมัครคนนี้จะถูกย้ายไป medtour อีกสาย';
                        } else {
                          warning =
                            '🔴 medtour เต็มผู้สมัครคนนี้จะไม่ได้รับสิทธิ์ในกิจกรรม medtour';
                        }
                      } else {
                        // Student will be accepted to their chosen group
                        acceptanceMessage = 'รับเข้ากิจกรรม medtalk medtour ตามที่เลือก';
                      }
                    } else {
                      // If capacity data is not loaded yet, show acceptance message as default
                      acceptanceMessage = 'รับเข้ากิจกรรม medtalk medtour ตามที่เลือก';
                    }
                  }
                  return (
                    <tr key={student.student_reference}>
                      <td>
                        <img
                          src={`data:image/jpeg;base64,${idx === 0 ? data.image_1 : data.image_2}`}
                          alt={`Student ${idx + 1}`}
                          style={{ width: '200px', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                      </td>
                      <td>
                        <img
                          src={`data:image/jpeg;base64,${idx === 0 ? data.imageCard_1 : data.imageCard_2}`}
                          alt={`Student ${idx + 1} Card`}
                          style={{ width: '200px', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                      </td>
                      <td>{student.firstname}</td>
                      <td>{student.lastname}</td>
                      <td>{student.student_id}</td>
                      <td>{student.grade}</td>
                      <td>{student.national_id}</td>
                      <td>{student.is_join_medtalk ? '✅' : '❌'}</td>
                      <td>{student.medtour_group || '-'}</td>
                      <td>
                        {warning && (
                          <div style={{ color: warning.startsWith('🔴') ? 'red' : 'orange' }}>
                            {warning}
                          </div>
                        )}
                        {acceptanceMessage && (
                          <div style={{ color: 'green' }}>{acceptanceMessage}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <h2>Payment Slip</h2>
            <h3>Total Payment: {team.total_payment}</h3>
            <img
              src={`data:image/jpeg;base64,${data.base64Slip}`}
              alt="Payment Slip"
              style={{ width: '500px' }}
            />

            <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
              <Button type="button" color="green" onClick={handleAccept}>
                ACCEPT
              </Button>
              <Button type="button" color="red" onClick={handleReject}>
                REJECT
              </Button>
            </div>
          </div>
        </Center>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <Center>
        <div>
          <h1>NO MORE TEAM</h1>
          <p>Pending teams older than 40 minutes: {pendingTeamsCount}</p>
          <Button
            type="button"
            color="red"
            onClick={handleCleanup}
            disabled={isCleaningUp}
            style={{ marginTop: '20px' }}
          >
            {isCleaningUp ? 'Cleaning up...' : 'Delete Pending Teams (>40min)'}
          </Button>
        </div>
      </Center>
    </AdminLayout>
  );
}
