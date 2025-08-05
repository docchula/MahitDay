# AMSci Registration Website v2

A web application for AMSci registration and announcements

Successor of [docchula/amsci-website](https://github.com/docchula/amsci-website), created by [Sarun Intaralawan](https://github.com/sarunint). Based on [Angular](https://angular.dev/).

## Features

- AMSci exam registration
- MedTalk registration
- Exam ticket printing
- Exam attendance
- Score announcement
- Certificate printing
- Links to associated websites or files

## Required maintenance

### Post-exam Guideline

1. นำไฟล์ที่ได้จากเครื่องตรวจ export ให้อยู่ใน format ที่สามารถ query ได้ เช่น `.csv`
   จากนั้นนำไฟล์ `.csv` ลงในฐานข้อมูลเรา เพื่อให้สามารถ query ได้
2. นำคะแนนจาก `.csv` สร้าง `TABLE report` เพื่อนำคะแนนเข้าสู่ `TABLE students` โดยเทียบเลขที่นั่งสอบ

> [!CAUTION]  
> ข้อควรระวัง ควรตรวจสอบว่าในไฟล์ `.csv` ไม่มีนักเรียนคนไหนที่มีเลขที่สอบซ้ำกัน ไม่เช่นนั้นอาจจะเขียนคะแนนซ้อนทับได้

> [!TIP]  
> สามารถตรวจสอบหานักเรียนที่ฝนเลขที่นั่งสอบแปลก ๆ ได้ตั้งแต่ขั้นตอนนี้ โดยอาจจะ sort เพื่อหาเลขที่นั่งสอบที่มากกว่า หรือน้อยกว่าค่าที่กำหนดไว้ (นักเรียนบางคนฝนหลักมาเกิน) โดยใช้ subquery

```sql
UPDATE students
SET students.score = (
    SELECT report.score
    FROM report
    WHERE students.student_id = report.student_id
);
```

Using `JOIN ON`

```sql
UPDATE students
JOIN report ON students.student_id = report.student_id
SET students.score = report.score;
```

3. ตรวจสอบว่า ไม่มีนักเรียนคนใดที่มาเข้าสอบแต่ไม่มีคะแนนในระบบ
   - ตรวจสอบจากคะแนน (ใช้วิธี `SELECT/ORDER` ออกมา)
     - คนที่เข้าสอบ ต้องมีคะแนนในช่องคะแนน
     - คนที่ไม่เข้าสอบ คะแนนจะต้องเป็น `NULL`
   - จำนวนนักเรียนที่มีคะแนน ต้องเท่ากับจำนวน row ในไฟล์คะแนนที่ได้มา ต้องเท่ากับกระดาษคำตอบที่เก็บได้
     - ดูจำนวน row ใน `report` หลังจากทำการ `UPDATE students` แล้ว
   - ตรวจสอบ query จากไฟล์ผลตรวจข้อสอบ ว่า `student_id` ไหนบ้างในไฟล์ผลตรวจข้อสอบที่ไม่มีใน `TABLE students` (ไม่ได้นำไป `UPDATE`)

```sql
SELECT report.student_id
FROM report
LEFT JOIN students ON report.student_id = students.student_id
WHERE students.student_id IS NULL;
```

> [!IMPORTANT]  
> ปัญหาที่พบได้บ่อยคือนักเรียนฝนเลขที่นั่งสอบมาไม่ถูกต้อง หรือเครื่องอ่านเลขที่นั่งสอบไม่ถูกต้อง **แล้วเครื่องอ่านได้เป็นเลขที่ไม่มีในเลขที่สอบ ทำให้ไม่ถูกนำคะแนนไปใส่ใน `TABLE students`**
4. นำคะแนนของนักเรียนในทีมเดียวกันมารวมเป็นคะแนนรวมของทีมและเรียงลำดับคะแนนตามทีม เพื่อคัดเลือกทีมที่ผ่านเข้ารอบ

```sql
SELECT
    teams.team_reference,
    teams.name,
    teams.email,
    SUM(students.student_score) AS team_summary_score,
    COUNT(DISTINCT CASE WHEN students.student_score IS NOT NULL THEN students.id END) AS number_of_students_with_score,
    users.province
FROM teams
LEFT JOIN students ON teams.team_reference = students.team_reference
INNER JOIN users ON users.email = teams.email
GROUP BY
    teams.team_reference, teams.name, teams.email, users.province
ORDER BY team_summary_score DESC;
```

## Dependencies

- [Next.js](https://nextjs.org/)
- [Mantine](https://mantine.dev/)
- Relational Database e.g. MySQL

## Developers

SMCU developers by generation. Add your name here when you're continuing the legacy!

- MDCU78: Ittipat Thanabodikarn
- MDCU78: Punyawish Patumhirunruksa
