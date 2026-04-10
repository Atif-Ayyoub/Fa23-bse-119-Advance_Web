using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.Sql;
using System.Data.SqlClient;

namespace SMS
{
    public partial class Form6 : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");
        public Form6()
        {
            InitializeComponent();
           
            dataGridView2.CellClick += dataGridView2_CellContentClick;
        }

        private void Form6_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'school_Management_SystemDataSet1.Student' table. You can move, or remove it, as needed.
            this.studentTableAdapter1.Fill(this.school_Management_SystemDataSet1.Student);
            // TODO: This line of code loads data into the 'school_Management_SystemDataSet.Class' table. You can move, or remove it, as needed.
            this.classTableAdapter.Fill(this.school_Management_SystemDataSet.Class);
            LoadStudentData();
        }
     

        private void LoadStudentData()
        {
            
                string query = @"SELECT 
                         Student_ID, 
                         Student_Name, 
                         Father_Name, 
                         Address, 
                         Date_of_Birth, 
                         Gender, 
                         Gurdian_Name, 
                         Contact_no, 
                         Email
                     FROM 
                         Student";
                     

                using (SqlConnection conn = new SqlConnection("Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True "))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        conn.Open();
                        SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                        DataTable table = new DataTable();
                        adapter.Fill(table);
                        dataGridView2.DataSource = table; // Assuming your grid view is named 'gridView'
                    }
                }
            

        }
       
        private void dataGridView2_CellContentClick(object sender, DataGridViewCellEventArgs e)
        { 
            try
            {
                // Get the index of the selected row
                int selectedRowIndex = e.RowIndex;

                // Make sure the row index is valid (i.e., the user clicked on a row)
                if (selectedRowIndex >= 0 && selectedRowIndex < dataGridView2.Rows.Count)
                {
                    // Get the row that the user clicked on
                    DataGridViewRow selectedRow = dataGridView2.Rows[selectedRowIndex];

                    // Now, fill the textboxes with the student's data 
                    textstudentid.Text = selectedRow.Cells[0].Value?.ToString() ?? string.Empty;
                    textstudentname.Text = selectedRow.Cells[1].Value?.ToString() ?? string.Empty;
                    textfathername.Text = selectedRow.Cells[2].Value?.ToString() ?? string.Empty;
                    textaddress.Text = selectedRow.Cells[3].Value?.ToString() ?? string.Empty;
                    textdob.Text = selectedRow.Cells[4].Value?.ToString() ?? string.Empty;
                    textgender.Text = selectedRow.Cells[5].Value?.ToString() ?? string.Empty;
                    textgname.Text = selectedRow.Cells[6].Value?.ToString() ?? string.Empty;
                    textphone.Text = selectedRow.Cells[7].Value?.ToString() ?? string.Empty;
                    textmail.Text = selectedRow.Cells[8].Value?.ToString() ?? string.Empty;
                    
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("An error occurred: " + ex.Message);
            }

        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {      

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void label2_Click(object sender, EventArgs e)
        {
            Form4 f4 = new Form4();
            f4.Show();
            this.Hide();
        }

        private void studentBindingSource_CurrentChanged(object sender, EventArgs e)
        {

        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void dataGridView1_CellContentClick_1(object sender, DataGridViewCellEventArgs e)
        {
           
        }
    




        private void panel2_Paint(object sender, PaintEventArgs e)
        {

        }

        private void label13_Click(object sender, EventArgs e)
        {
            Form4 f4 = new Form4();
            f4.Show();
            this.Hide();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            
                try
                {
                    // Check if Student ID is provided
                    if (string.IsNullOrEmpty(textstudentid.Text))
                    {
                        MessageBox.Show("Please select a student to update.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        return;
                    }

                    // SQL query to update the student's details
                    string query = @"UPDATE Student
                         SET 
                             Student_Name = @Student_Name, 
                             Father_Name = @Father_Name, 
                             Address = @Address, 
                             Date_of_Birth = @Date_of_Birth, 
                             Gender = @Gender, 
                             Gurdian_Name = @Gurdian_Name, 
                             Contact_no = @Contact_no, 
                             Email = @Email
                         WHERE 
                             Student_ID = @Student_ID";

                    // Open connection
                    using (SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True"))
                    {
                        using (SqlCommand cmd = new SqlCommand(query, conn))
                        {
                            // Add parameters to avoid SQL injection
                            cmd.Parameters.AddWithValue("@Student_ID", textstudentid.Text);
                            cmd.Parameters.AddWithValue("@Student_Name", textstudentname.Text);
                            cmd.Parameters.AddWithValue("@Father_Name", textfathername.Text);
                            cmd.Parameters.AddWithValue("@Address", textaddress.Text);
                            cmd.Parameters.AddWithValue("@Date_of_Birth", textdob.Text);
                            cmd.Parameters.AddWithValue("@Gender", textgender.Text);
                            cmd.Parameters.AddWithValue("@Gurdian_Name", textgname.Text);
                            cmd.Parameters.AddWithValue("@Contact_no", textphone.Text);
                            cmd.Parameters.AddWithValue("@Email", textmail.Text);
                    

                            // Execute the update
                            conn.Open();
                            int rowsAffected = cmd.ExecuteNonQuery();
                            conn.Close();

                            // Show success message
                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Student details updated successfully!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                                LoadStudentData(); // Refresh the grid view
                            }
                            else
                            {
                                MessageBox.Show("Failed to update student details.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("An error occurred: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
        

        }
        private void ClearTextBoxes()
        {
            textstudentid.Clear();
            textstudentname.Clear();
            textfathername.Clear();
            textaddress.Clear();
            textdob.Clear();
            textgender.Clear();
            textgname.Clear();
            textphone.Clear();
            textmail.Clear();
          
        }

        private void button4_Click(object sender, EventArgs e)
        {
         
                // Get the student ID from the form field
                string studentID = textstudentid.Text;

                // Ask for confirmation before deletion
                DialogResult dialogResult = MessageBox.Show("Are you sure you want to delete this student?", "Confirmation", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);

                if (dialogResult == DialogResult.Yes)
                {
                // Queries to delete data
                string deletefeeQuery = "DELETE FROM Fee WHERE Student_ID = @studentID";
                string deleteAttendanceQuery = "DELETE FROM Attendance WHERE Student_ID = @studentID";
                    string deleteStudentQuery = "DELETE FROM Student WHERE Student_ID = @studentID";

                    using (SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True"))
                    {
                        try
                        {
                            conn.Open();

                            // Start a transaction to ensure both deletes succeed
                            using (SqlTransaction transaction = conn.BeginTransaction())
                            {
                                try
                                {
                                    // Delete attendance records first
                                    using (SqlCommand cmd1 = new SqlCommand(deleteAttendanceQuery, conn, transaction))
                                    {
                                        cmd1.Parameters.AddWithValue("@studentID", studentID);
                                        cmd1.ExecuteNonQuery();
                                    }
                                using (SqlCommand cmd3 = new SqlCommand(deletefeeQuery, conn, transaction))
                                {
                                    cmd3.Parameters.AddWithValue("@studentID", studentID);
                                    cmd3.ExecuteNonQuery();
                                }

                                // Delete student record
                                using (SqlCommand cmd2 = new SqlCommand(deleteStudentQuery, conn, transaction))
                                    {
                                        cmd2.Parameters.AddWithValue("@studentID", studentID);
                                        int rowsAffected = cmd2.ExecuteNonQuery();

                                        if (rowsAffected > 0)
                                        {
                                            // Commit transaction
                                            transaction.Commit();

                                            MessageBox.Show("Student and related records deleted successfully!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);

                                            // Refresh DataGridView
                                            LoadStudentData();
                                            ClearTextBoxes();
                                        }
                                        else
                                        {
                                            // Rollback transaction if student not found
                                            transaction.Rollback();
                                            MessageBox.Show("Student not found. Please check the Student ID.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                                        }
                                    }
                                }
                                catch (Exception ex)
                                {
                                    // Rollback transaction on error
                                    transaction.Rollback();
                                    MessageBox.Show("An error occurred: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                                }
                            }

                            conn.Close();
                        }
                        catch (Exception ex)
                        {
                            MessageBox.Show("Database connection error: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        }
                    }
                }
            





        }

        private void textstudentid_TextChanged(object sender, EventArgs e)
        {

        }

        private void fillByToolStripButton_Click(object sender, EventArgs e)
        {
           
        }

        private void dataGridView2_CellContentClick_1(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void dataGridView2_CellContentClick_2(object sender, DataGridViewCellEventArgs e)
        {

        }
    }
}
