using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;



namespace SMS
{
    public partial class classes : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");


        public classes()
        {
            InitializeComponent();
        }
        private Panel FindPanelRecursive(Control parent, string panelName)
        {
            foreach (Control control in parent.Controls)
            {
                if (control is Panel && control.Name == panelName)
                    return (Panel)control;

                // Recursively search nested controls
                Panel nestedPanel = FindPanelRecursive(control, panelName);
                if (nestedPanel != null)
                    return nestedPanel;
            }
            return null;
        }

        private void UpdateNurseryPanel()
        {
            // Find the Nursery panel even if it's nested
            Panel nurseryPanel = FindPanelRecursive(this, "panelNursery");

            if (nurseryPanel == null)
            {
                MessageBox.Show("Nursery panel not found. Check its Name property in the Designer.");
                return;
            }

            // Fetch data for Nursery class from the database
            string connectionString = "Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";
            string query = @"
        SELECT 
            c.Class_Name,
            t.First_Name AS Teacher_Name,
            COUNT(s.Student_ID) AS Total_Students
        FROM 
            Class c
        LEFT JOIN 
            Teacher t ON c.Teacher_ID = t.Teacher_ID
        LEFT JOIN 
            Student s ON s.Class_ID = c.Class_ID
        WHERE 
            c.Class_Name = 'Nursery'
        GROUP BY 
            c.Class_Name, t.First_Name;
    ";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();

                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    string teacherName = reader["Teacher_Name"].ToString();
                    string totalStudents = reader["Total_Students"].ToString();

                    // Update labels in the Nursery panel
                    Label lblTeacher = nurseryPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTeacher");
                    Label lblTotalStudents = nurseryPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTotalStudents");

                    if (lblTeacher != null) lblTeacher.Text =  teacherName;
                    if (lblTotalStudents != null) lblTotalStudents.Text =  totalStudents;
                }
                else
                {
                    MessageBox.Show("No data found for Nursery class.");
                }

                connection.Close();
            }
        }

        private void UpdatePrepClassPanel()
        {
            // Find the Prep Class panel even if it's nested
            Panel prepClassPanel = FindPanelRecursive(this, "panelPrepClass");

            if (prepClassPanel == null)
            {
                MessageBox.Show("Prep Class panel not found. Check its Name property in the Designer.");
                return;
            }

            // Fetch data for Prep Class from the database
            string connectionString = "Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";
            string query = @"
        SELECT 
            c.Class_Name,
            t.First_Name AS Teacher_Name,
            COUNT(s.Student_ID) AS Total_Students
        FROM 
            Class c
        LEFT JOIN 
            Teacher t ON c.Teacher_ID = t.Teacher_ID
        LEFT JOIN 
            Student s ON s.Class_ID = c.Class_ID
        WHERE 
            c.Class_Name = 'Prep'
        GROUP BY 
            c.Class_Name, t.First_Name;
    ";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();

                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    string teacherName = reader["Teacher_Name"].ToString();
                    string totalStudents = reader["Total_Students"].ToString();

                    // Update labels in the Prep Class panel
                    Label lblTeacher = prepClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTeacherPrepClass");
                    Label lblTotalStudents = prepClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTotalStudentsPrepClass");

                    if (lblTeacher != null) lblTeacher.Text =  teacherName;
                    if (lblTotalStudents != null) lblTotalStudents.Text =  totalStudents;
                }
                else
                {
                    MessageBox.Show("No data found for Prep Class.");
                }

                connection.Close();
            }
        }

        private void UpdateOneClassPanel()
        {
            // Find the One Class panel even if it's nested
            Panel oneClassPanel = FindPanelRecursive(this, "panelOneClass");

            if (oneClassPanel == null)
            {
                MessageBox.Show("One Class panel not found. Check its Name property in the Designer.");
                return;
            }

            // Fetch data for One Class from the database
            string connectionString = "Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";
            string query = @"
        SELECT 
            c.Class_Name,
            t.First_Name AS Teacher_Name,
            COUNT(s.Student_ID) AS Total_Students
        FROM 
            Class c
        LEFT JOIN 
            Teacher t ON c.Teacher_ID = t.Teacher_ID
        LEFT JOIN 
            Student s ON s.Class_ID = c.Class_ID
        WHERE 
            c.Class_Name = 'One '
        GROUP BY 
            c.Class_Name, t.First_Name;
    ";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();

                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    string teacherName = reader["Teacher_Name"].ToString();
                    string totalStudents = reader["Total_Students"].ToString();

                    // Update labels in the One Class panel
                    Label lblTeacher = oneClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTeacherOneClass");
                    Label lblTotalStudents = oneClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTotalStudentsOneClass");

                    if (lblTeacher != null) lblTeacher.Text = teacherName;
                    if (lblTotalStudents != null) lblTotalStudents.Text = totalStudents;
                }
                else
                {
                    MessageBox.Show("No data found for One Class.");
                }

                connection.Close();
            }
        }
        private void UpdateTwoClassPanel()
        {
            // Find the Two Class panel even if it's nested
            Panel twoClassPanel = FindPanelRecursive(this, "panelTwoClass");

            if (twoClassPanel == null)
            {
                MessageBox.Show("Two Class panel not found. Check its Name property in the Designer.");
                return;
            }

            // Fetch data for Two Class from the database
            string connectionString = "Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";
            string query = @"
        SELECT 
            c.Class_Name,
            t.First_Name AS Teacher_Name,
            COUNT(s.Student_ID) AS Total_Students
        FROM 
            Class c
        LEFT JOIN 
            Teacher t ON c.Teacher_ID = t.Teacher_ID
        LEFT JOIN 
            Student s ON s.Class_ID = c.Class_ID
        WHERE 
            c.Class_Name = 'Two'
        GROUP BY 
            c.Class_Name, t.First_Name;
    ";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();

                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    string teacherName = reader["Teacher_Name"].ToString();
                    string totalStudents = reader["Total_Students"].ToString();

                    // Update labels in the Two Class panel
                    Label lblTeacher = twoClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTeacherTwoClass");
                    Label lblTotalStudents = twoClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTotalStudentsTwoClass");

                    if (lblTeacher != null) lblTeacher.Text =  teacherName;
                    if (lblTotalStudents != null) lblTotalStudents.Text = totalStudents;
                }
                else
                {
                    MessageBox.Show("No data found for Two Class.");
                }

                connection.Close();
            }
        }

        private void UpdateThreeClassPanel()
        {
            // Find the Three Class panel even if it's nested
            Panel threeClassPanel = FindPanelRecursive(this, "panelThreeClass");

            if (threeClassPanel == null)
            {
                MessageBox.Show("Three Class panel not found. Check its Name property in the Designer.");
                return;
            }

            // Fetch data for Three Class from the database
            string connectionString = "Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";
            string query = @"
        SELECT 
            c.Class_Name,
            t.First_Name AS Teacher_Name,
            COUNT(s.Student_ID) AS Total_Students
        FROM 
            Class c
        LEFT JOIN 
            Teacher t ON c.Teacher_ID = t.Teacher_ID
        LEFT JOIN 
            Student s ON s.Class_ID = c.Class_ID
        WHERE 
            c.Class_Name = 'Three'
        GROUP BY 
            c.Class_Name, t.First_Name;
    ";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();

                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    string teacherName = reader["Teacher_Name"].ToString();
                    string totalStudents = reader["Total_Students"].ToString();

                    // Update labels in the Three Class panel
                    Label lblTeacher = threeClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTeacherThreeClass");
                    Label lblTotalStudents = threeClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTotalStudentsThreeClass");

                    if (lblTeacher != null) lblTeacher.Text = teacherName;
                    if (lblTotalStudents != null) lblTotalStudents.Text = totalStudents;
                }
                else
                {
                    MessageBox.Show("No data found for Three Class.");
                }

                connection.Close();
            }
        }
        private void UpdateFourClassPanel()
        {
            // Find the Four Class panel even if it's nested
            Panel fourClassPanel = FindPanelRecursive(this, "panelFourClass");

            if (fourClassPanel == null)
            {
                MessageBox.Show("Four Class panel not found. Check its Name property in the Designer.");
                return;
            }

            // Fetch data for Four Class from the database
            string connectionString = "Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";
            string query = @"
        SELECT 
            c.Class_Name,
            t.First_Name AS Teacher_Name,
            COUNT(s.Student_ID) AS Total_Students
        FROM 
            Class c
        LEFT JOIN 
            Teacher t ON c.Teacher_ID = t.Teacher_ID
        LEFT JOIN 
            Student s ON s.Class_ID = c.Class_ID
        WHERE 
            c.Class_Name = 'Four '
        GROUP BY 
            c.Class_Name, t.First_Name;
    ";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();

                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    string teacherName = reader["Teacher_Name"].ToString();
                    string totalStudents = reader["Total_Students"].ToString();

                    // Update labels in the Four Class panel
                    Label lblTeacher = fourClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTeacherFourClass");
                    Label lblTotalStudents = fourClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTotalStudentsFourClass");

                    if (lblTeacher != null) lblTeacher.Text = teacherName;
                    if (lblTotalStudents != null) lblTotalStudents.Text = totalStudents;
                }
                else
                {
                    MessageBox.Show("No data found for Four Class.");
                }

                connection.Close();
            }
        }
        private void UpdateFiveClassPanel()
        {
            // Find the Five Class panel even if it's nested
            Panel fiveClassPanel = FindPanelRecursive(this, "panelFiveClass");

            if (fiveClassPanel == null)
            {
                MessageBox.Show("Five Class panel not found. Check its Name property in the Designer.");
                return;
            }

            // Fetch data for Five Class from the database
            string connectionString = "Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True";
            string query = @"
        SELECT 
            c.Class_Name,
            t.First_Name AS Teacher_Name,
            COUNT(s.Student_ID) AS Total_Students
        FROM 
            Class c
        LEFT JOIN 
            Teacher t ON c.Teacher_ID = t.Teacher_ID
        LEFT JOIN 
            Student s ON s.Class_ID = c.Class_ID
        WHERE 
            c.Class_Name = 'Five'
        GROUP BY 
            c.Class_Name, t.First_Name;
    ";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();

                SqlDataReader reader = command.ExecuteReader();
                if (reader.Read())
                {
                    string teacherName = reader["Teacher_Name"].ToString();
                    string totalStudents = reader["Total_Students"].ToString();

                    // Update labels in the Five Class panel
                    Label lblTeacher = fiveClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTeacherFiveClass");
                    Label lblTotalStudents = fiveClassPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTotalStudentsFiveClass");

                    if (lblTeacher != null) lblTeacher.Text =  teacherName;
                    if (lblTotalStudents != null) lblTotalStudents.Text =  totalStudents;
                }
                else
                {
                    MessageBox.Show("No data found for Five Class.");
                }

                connection.Close();
            }
        }

        /*  private void UpdateNurseryPanel(string teacherName, string totalStudents)
          {
              // Locate the Nursery panel
              Panel nurseryPanel = this.Controls.OfType<Panel>().FirstOrDefault(p => p.Name == "panelNursery");

              if (nurseryPanel != null)
              {
                  // Locate the specific labels inside the Nursery panel
                  Label lblTeacher = nurseryPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTeacher");
                  Label lblTotalStudents = nurseryPanel.Controls.OfType<Label>().FirstOrDefault(l => l.Name == "lblTotalStudents");

                  // Update the labels
                  if (lblTeacher != null) lblTeacher.Text =  teacherName;
                  if (lblTotalStudents != null) lblTotalStudents.Text =  totalStudents;
              }
              else
              {
                  MessageBox.Show("Nursery panel not found. Check its Name property in the Designer.");
              }
          }*/

        private void label15_Click(object sender, EventArgs e)
        {

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void classes_Load(object sender, EventArgs e)
        {
            UpdateNurseryPanel();
            UpdatePrepClassPanel();
            UpdateOneClassPanel();
            UpdateTwoClassPanel();
            UpdateThreeClassPanel();
            UpdateFourClassPanel();
            UpdateFiveClassPanel();
        }
        

    




        private void panel2_Paint(object sender, PaintEventArgs e)
        {

        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            class01 c1 = new class01();
            c1.Show();
            this.Hide();
        }

        private void button6_Click(object sender, EventArgs e)
        {
            class02 c2 = new class02();
            c2.Show();
            this.Hide();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            class03 c3 = new class03();
            c3.Show();
            this.Hide();
        }

        private void button7_Click(object sender, EventArgs e)
        {
            class04 c4 = new class04();
            c4.Show();
            this.Hide();
        }

        private void button4_Click(object sender, EventArgs e)
        {
            class05 c5 = new class05();
            c5.Show();
            this.Hide();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            class06 c6 = new class06();
            c6.Show();
            this.Hide();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            class07 c7 = new class07();
            c7.Show();
            this.Hide();
        }

        private void label5_Click(object sender, EventArgs e)
        {
            Form4 c = new Form4();
            c.Show();
            this.Hide();
        }
    }
    
}
