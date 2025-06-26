function createStudent(usn, subjectCode, subjectName, cieMarks, seeMarks) {
  // Private variables: accessible only within this function scope
  let _cieMarks = cieMarks;
  let _seeMarks = seeMarks;

  return {
    // Public properties
    usn: usn,
    subjectCode: subjectCode,
    subjectName: subjectName,

    // Method to calculate and return total marks
    getTotalMarks: function () {
      return _cieMarks + _seeMarks;
    },

    // Method to display full student details
    displayDetails: function () {
      console.log("Student USN       : " + this.usn);
      console.log("Subject Code      : " + this.subjectCode);
      console.log("Subject Name      : " + this.subjectName);
      console.log("Total Marks       : " + this.getTotalMarks());
      console.log("--------------------------------------");
    }
  };
}

// Example usage:
const student1 = createStudent("1RV23CS001", "CS101", "Data Structures", 35, 55);
const student2 = createStudent("1RV23CS002", "CS102", "Operating Systems", 30, 50);

// Display student data
student1.displayDetails();
student2.displayDetails();

// Attempting to access private marks directly will fail (undefined)
console.log(student1._cieMarks); // undefined
console.log(student1._seeMarks); // undefined
