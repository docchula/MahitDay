export const transFormRoomNumber = (id: any) => {
  try {
    const studentNumber = Number(id);
    let stringBuilding: string = '';

    const thirdDigit = Math.floor((studentNumber / 10000000) % 10);
    const stringRoom = String(studentNumber).slice(3, 7);
    //const seatNumber = studentNumber % 1000;

    switch (thirdDigit) {
      case 1: {
        stringBuilding = 'รัตนวิทยพัฒน์';
        break;
      }
      case 2: {
        stringBuilding = 'ภูมิสิริมังคลานุสรณ์';
        break;
      }
    }

    if (stringRoom === '0001') {
      return `สอบที่อาคาร ${stringBuilding} ห้อง โถง`;
    }

    return `สอบที่อาคาร ${stringBuilding} ห้อง ${stringRoom}`;
  } catch {
    return 'error';
  }
};
