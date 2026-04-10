using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SMS
{
    public partial class class01 : Form
    {
        public class01()
        {
            InitializeComponent();
        }
        private void LoadNurseryStudents()
        {
            try
            {
                // Database connection string
                string connectionString = @"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";

                // SQL query to join Student and Class tables
                string query = @"
        SELECT 
            s.Student_ID, 
            s.Student_Name, 
            s.Father_Name, 
            s.Address, 
            s.Date_of_Birth, 
            s.Gender,
            s.Gurdian_Name,
            s.Contact_no, 
            s.Email,
            c.Class_Name
        FROM 
            Student s
        INNER JOIN 
            Class c ON s.Class_ID = c.Class_ID
        WHERE 
            c.Class_Name = 'Nursery';";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlDataAdapter adapter = new SqlDataAdapter(query, conn);
                    DataTable dataTable = new DataTable();
                    adapter.Fill(dataTable);

                    // Bind the DataTable to the DataGridView
                    dataGridViewNursery.DataSource = dataTable;

                    
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error: " + ex.Message);
            }
        }
        private void LoadClassDetails()
        {
            try
            {
                // Connection string
                string connectionString = @"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    // Query to fetch the teacher's first name
                    string queryTeacher = @"
            SELECT t.First_Name 
            FROM Class c
            INNER JOIN Teacher t ON c.Teacher_ID = t.Teacher_ID
            WHERE c.Class_Name = 'Nursery';";

                    SqlCommand cmdTeacher = new SqlCommand(queryTeacher, conn);
                    object teacherName = cmdTeacher.ExecuteScalar();
                    teachername.Text = teacherName != null ? teacherName.ToString() : "N/A"; // Update the teacher label

                    // Query to fetch total students
                    string queryTotalStudents = @"
            SELECT COUNT(*) 
            FROM Student 
            WHERE Class_ID = (SELECT Class_ID FROM Class WHERE Class_Name = 'Nursery');";

                    SqlCommand cmdTotalStudents = new SqlCommand(queryTotalStudents, conn);
                    object totalStudents = cmdTotalStudents.ExecuteScalar();
                    totalstudent.Text = totalStudents != null ? totalStudents.ToString() : "0"; // Update the total students label
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error: " + ex.Message);
            }
        }


        private void monday_Click(object sender, EventArgs e)
        {

        }

        private void label4_Click(object sender, EventArgs e)
        {

        }

        private void tableLayoutPanel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void label19_Click(object sender, EventArgs e)
        {

        }

        private void label54_Click(object sender, EventArgs e)
        {

        }

        private void class01_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'school_Management_SystemDataSet1.Student' table. You can move, or remove it, as needed.
            this.studentTableAdapter.Fill(this.school_Management_SystemDataSet1.Student);
            // TODO: This line of code loads data into the 'school_Management_SystemDataSet.Class' table. You can move, or remove it, as needed.
            this.classTableAdapter.Fill(this.school_Management_SystemDataSet.Class);
            // TODO: This line of code loads data into the 'school_Management_SystemDataSet.Class' table. You can move, or remove it, as needed.
            this.classTableAdapter.Fill(this.school_Management_SystemDataSet.Class);
            LoadNurseryStudents();
            LoadClassDetails();
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void label32_Click(object sender, EventArgs e)
        {
            classes c1 = new classes();
            c1.Show();
            this.Hide();
        }
    }
}
