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
    public partial class attendance01 : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");
        public attendance01()
        {
            InitializeComponent();
            comboBox1.SelectedIndexChanged += comboBox1_SelectedIndexChanged;
          

        }
        private void LoadClasses()
        {
            string query = "SELECT Class_ID, Class_Name FROM Class";  // Fetch all classes from the Class table
            SqlDataAdapter adapter = new SqlDataAdapter(query, conn);
            DataTable classesTable = new DataTable();
            adapter.Fill(classesTable);

            comboBox1.DisplayMember = "Class_Name";  // Display class name in the ComboBox
            comboBox1.ValueMember = "Class_ID";     // Set the value member to Class_ID for easy reference
            comboBox1.DataSource = classesTable;    // Set the data source to the DataTable
        }
        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            // Ensure a valid selection
            if (comboBox1.SelectedValue != null && int.TryParse(comboBox1.SelectedValue.ToString(), out int selectedClassID))
            {
                LoadStudentsForAttendance(selectedClassID);
                LoadTeacherForClass(selectedClassID);
            }
        }



        private void LoadStudentsForAttendance(int classId)
        {
            try
            {
                // SQL query to fetch all students of the selected class by Class_ID
                string query = @"
        SELECT Student_ID, Student_Name 
        FROM Student
        WHERE Class_ID = @Class_ID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Class_ID", classId);

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    // Clear any existing controls in the FlowLayoutPanel
                    flowLayoutPanelAttendence.Controls.Clear();

                    // Adjust FlowLayoutPanel properties
                    flowLayoutPanelAttendence.AutoScroll = true;
                    flowLayoutPanelAttendence.WrapContents = false;
                    flowLayoutPanelAttendence.FlowDirection = FlowDirection.TopDown;

                    // Add a styled panel for each student
                    while (reader.Read())
                    {
                        string studentName = reader["Student_Name"].ToString();
                        int studentID = Convert.ToInt32(reader["Student_ID"]);

                        // Create a panel to hold student details and controls
                        Panel studentPanel = new Panel();
                        studentPanel.Size = new Size(flowLayoutPanelAttendence.Width - 20, 50); // Increased height for better layout
                        studentPanel.Margin = new Padding(5);
                        studentPanel.BorderStyle = BorderStyle.FixedSingle;

                        // Create a label for student name
                        Label studentLabel = new Label();
                        studentLabel.Text = studentName;
                        studentLabel.Font = new Font("Arial", 10, FontStyle.Regular);
                        studentLabel.AutoSize = true;
                        studentLabel.Location = new Point(10, (studentPanel.Height - studentLabel.Height) / 2); // Center vertically

                        // Create radio buttons for Present/Absent
                        RadioButton rbPresent = new RadioButton();
                        rbPresent.Text = "Present";
                        rbPresent.Tag = studentID;  // Use Tag to store the student ID
                        rbPresent.AutoSize = true; // Ensure it resizes properly
                        rbPresent.Location = new Point(studentPanel.Width - 220, (studentPanel.Height - rbPresent.Height) / 2);

                        RadioButton rbAbsent = new RadioButton();
                        rbAbsent.Text = "Absent";
                        rbAbsent.Tag = studentID;  // Use Tag to store the student ID
                        rbAbsent.AutoSize = true; // Ensure it resizes properly
                        rbAbsent.Location = new Point(studentPanel.Width - 120, (studentPanel.Height - rbAbsent.Height) / 2);

                        // Add controls to the panel
                        studentPanel.Controls.Add(studentLabel);
                        studentPanel.Controls.Add(rbPresent);
                        studentPanel.Controls.Add(rbAbsent);

                        // Add the panel to the FlowLayoutPanel
                        flowLayoutPanelAttendence.Controls.Add(studentPanel);
                    }

                    reader.Close();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error: " + ex.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
        }


        private void LoadTeacherForClass(int classId)
        {
            try
            {
                // SQL query to fetch the teacher's name for the selected class
                string query = @"
        SELECT T.First_Name 
        FROM Class C
        INNER JOIN Teacher T ON C.Teacher_ID = T.Teacher_ID
        WHERE C.Class_ID = @Class_ID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Class_ID", classId);

                    conn.Open();
                    object result = cmd.ExecuteScalar();  // Fetch the teacher's name

                    // Display the teacher's name in the label or TextBox
                    if (result != null)
                    {
                        teacher.Text = result.ToString();
                    }
                    else
                    {
                        teacher.Text = "No teacher assigned";
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error: " + ex.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
        }



        private void attendance01_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'school_Management_SystemDataSet7.Class' table. You can move, or remove it, as needed.
            this.classTableAdapter.Fill(this.school_Management_SystemDataSet7.Class);
            LoadClasses();

        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            
                try
                {
                    // Retrieve the selected class ID and date
                    int classId = Convert.ToInt32(comboBox1.SelectedValue);
                    DateTime attendanceDate = dateTimePicker.Value;

                    // Open the database connection only once
                    conn.Open();

                    foreach (Control control in flowLayoutPanelAttendence.Controls)
                    {
                        if (control is Panel studentPanel)
                        {
                            // Check the radio buttons inside the panel
                            RadioButton rbPresent = studentPanel.Controls.OfType<RadioButton>().FirstOrDefault(rb => rb.Text == "Present" && rb.Checked);
                            RadioButton rbAbsent = studentPanel.Controls.OfType<RadioButton>().FirstOrDefault(rb => rb.Text == "Absent" && rb.Checked);

                            if (rbPresent != null || rbAbsent != null)
                            {
                                int studentId = Convert.ToInt32(rbPresent?.Tag ?? rbAbsent.Tag);
                                string attendanceStatus = rbPresent != null ? "Present" : "Absent";

                                // Prepare the SQL query
                                string query = @"INSERT INTO Attendance (Student_ID, Class_ID, Date, Status) 
                                     VALUES (@Student_ID, @Class_ID, @Date, @Status)";

                                using (SqlCommand cmd = new SqlCommand(query, conn))
                                {
                                    cmd.Parameters.AddWithValue("@Student_ID", studentId);
                                    cmd.Parameters.AddWithValue("@Class_ID", classId);
                                    cmd.Parameters.AddWithValue("@Date", attendanceDate);
                                    cmd.Parameters.AddWithValue("@Status", attendanceStatus);

                                    // Execute the query
                                    cmd.ExecuteNonQuery();
                                }
                            }
                        }
                    }

                    MessageBox.Show("Attendance marked successfully!");
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Error: " + ex.Message);
                }
                finally
                {
                    // Close the connection in the `finally` block to ensure it's always closed
                    if (conn.State == ConnectionState.Open)
                        conn.Close();
                }
            



        }

        private void flowLayoutPanel_Paint(object sender, PaintEventArgs e)
        {

        }

        private void label4_Click(object sender, EventArgs e)
        {
            Form4 c = new Form4();
            c.Show();
            this.Hide();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            attendanceReport c = new attendanceReport();
            c.Show();
            this.Hide();
        }
    }
}
