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
    public partial class class04 : Form
    {
        public class04()
        {
            InitializeComponent();
        }
        private void LoadClassTwoStudents()
        {
            try
            {
                // Database connection string
                string connectionString = @"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";

                // SQL query to join Student and Class tables for "Class Two"
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
            c.Class_Name = 'Two';";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlDataAdapter adapter = new SqlDataAdapter(query, conn);
                    DataTable dataTable = new DataTable();
                    adapter.Fill(dataTable);

                    // Bind the DataTable to the DataGridView
                    dataGridViewTwo.DataSource = dataTable; // Make sure dataGridViewClassTwo is your DataGridView name
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error: " + ex.Message);
            }
        }

        private void LoadClassTwoDetails()
        {
            try
            {
                // Connection string
                string connectionString = @"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    // Query to fetch the teacher's first name for "Class Two"
                    string queryTeacher = @"
            SELECT t.First_Name 
            FROM Class c
            INNER JOIN Teacher t ON c.Teacher_ID = t.Teacher_ID
            WHERE c.Class_Name = 'Two';";

                    SqlCommand cmdTeacher = new SqlCommand(queryTeacher, conn);
                    object teacherName = cmdTeacher.ExecuteScalar();
                    teachername.Text = teacherName != null ? teacherName.ToString() : "N/A"; // Update the teacher label

                    // Query to fetch total students for "Class Two"
                    string queryTotalStudents = @"
            SELECT COUNT(*) 
            FROM Student 
            WHERE Class_ID = (SELECT Class_ID FROM Class WHERE Class_Name = 'Two');";

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

        private void dataGridViewOne_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void class04_Load(object sender, EventArgs e)
        {
            LoadClassTwoStudents();
            LoadClassTwoDetails();
        }

        private void label15_Click(object sender, EventArgs e)
        {
            classes c1 = new classes();
            c1.Show();
            this.Hide();
        }
    }
}
