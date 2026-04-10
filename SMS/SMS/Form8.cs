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

    public partial class Form8 : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");
        public Form8()
        {
            
            InitializeComponent();
        }

        private void Form8_Load(object sender, EventArgs e)
        {
            LoadTeacherData();
            // TODO: This line of code loads data into the 'school_Management_SystemDataSet2.Teacher' table. You can move, or remove it, as needed.
            this.teacherTableAdapter.Fill(this.school_Management_SystemDataSet2.Teacher);

        }
        private void LoadTeacherData()
        {
            conn.Open();
            // Create SQL query for fetching student data
            string query = "SELECT * FROM Teacher";
            SqlDataAdapter dataAdapter = new SqlDataAdapter(query, conn);
            DataTable dataTable = new DataTable();
            dataAdapter.Fill(dataTable);

            // Bind data to DataGridView
            dataGridView1.DataSource = dataTable;
            conn.Close();
        }
        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            try
            {
                // Get the index of the selected row
                int selectedRowIndex = e.RowIndex;

                // Make sure the row index is valid (i.e., the user clicked on a row)
                if (selectedRowIndex >= 0 && selectedRowIndex < dataGridView1.Rows.Count)
                {
                    // Get the row that the user clicked on
                    DataGridViewRow selectedRow = dataGridView1.Rows[selectedRowIndex];

                    // Now, fill the textboxes with the student's data
                    textteacherid.Text = selectedRow.Cells[0].Value?.ToString() ?? string.Empty;
                    textfirstname.Text = selectedRow.Cells[1].Value?.ToString() ?? string.Empty;
                    textlastname.Text = selectedRow.Cells[2].Value?.ToString() ?? string.Empty;
                    textaddress.Text = selectedRow.Cells[3].Value?.ToString() ?? string.Empty;
                    textdob.Text = selectedRow.Cells[4].Value?.ToString() ?? string.Empty;
                    textnumber.Text = selectedRow.Cells[5].Value?.ToString() ?? string.Empty;
                    textqualification.Text = selectedRow.Cells[6].Value?.ToString() ?? string.Empty;
                    textgender.Text = selectedRow.Cells[7].Value?.ToString() ?? string.Empty;
                    textemail.Text = selectedRow.Cells[8].Value?.ToString() ?? string.Empty;
                    textdateofjoining.Text = selectedRow.Cells[9].Value?.ToString() ?? string.Empty;
                    textsalary.Text = selectedRow.Cells[10].Value?.ToString() ?? string.Empty;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("An error occurred: " + ex.Message);
            }
        }

        private void label2_Click(object sender, EventArgs e)
        {
            Form4 f4 = new Form4();
            f4.Show();
            this.Hide();
        }

        private void button5_Click(object sender, EventArgs e)
        {

            // Get the updated values from the form fields
            string teacherID = textteacherid.Text;
            string firstName = textfirstname.Text;
            string lastName = textlastname.Text;
            string address = textaddress.Text;
            string dateOfBirth = textdob.Text;
            string number = textnumber.Text;
            string qualification = textqualification.Text;
            string gender = textgender.Text;
            string email = textemail.Text;
            string dateofjoining = textdateofjoining.Text;
            string salary = textsalary.Text;

            // Validate that required fields are not empty
            if (string.IsNullOrEmpty(teacherID) || string.IsNullOrEmpty(firstName))
            {
                MessageBox.Show("Teacher ID and Name are required.");
                return;
            }

            // Try to parse the date of birth
            DateTime parsedDateOfBirth;
            if (!DateTime.TryParse(dateOfBirth, out parsedDateOfBirth))
            {
                MessageBox.Show("Invalid Date of Birth. Please enter in the correct format (e.g., yyyy-mm-dd).");
                return;
            }

            // SQL query to update the student record
            string query = @"UPDATE Teacher SET 
                     First_Name = @firstName, 
                     Last_Name = @lastName, 
                     address = @address, 
                     Date_of_Birth = @dateOfBirth, 
                     contactno = @number, 
                     qualification = @qualification, 
                     gender = @gender, 
                     email = @email, 
                     dateOfJoining = @dateofjoining,
                     salary=@salary
                     WHERE Teacher_ID = @teacherID";

            try
            {
                // Ensure that the connection is properly initialized and open before executing the query
                using (SqlConnection conn = new SqlConnection("Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True "))
                {
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        // Assign parameters to avoid SQL injection
                        cmd.Parameters.AddWithValue("@teacherID", teacherID);
                        cmd.Parameters.AddWithValue("@firstName", firstName);
                        cmd.Parameters.AddWithValue("@lastName", lastName);
                        cmd.Parameters.AddWithValue("@address", address);
                        cmd.Parameters.AddWithValue("@dateOfBirth", parsedDateOfBirth);
                        cmd.Parameters.AddWithValue("@number", number);
                        cmd.Parameters.AddWithValue("@qualification", qualification);
                        cmd.Parameters.AddWithValue("@gender", gender);
                        cmd.Parameters.AddWithValue("@email", email);
                        cmd.Parameters.AddWithValue("@dateofjoining", dateofjoining);
                        cmd.Parameters.AddWithValue("@salary", salary);
                        // Open the connection
                        conn.Open();

                        // Execute the update query
                        int rowsAffected = cmd.ExecuteNonQuery();

                        // Check if any rows were affected (if not, it means the update failed)
                        if (rowsAffected > 0)
                        {
                            MessageBox.Show("Teachers details updated successfully!");
                            // Refresh the DataGridView after successful update
                            LoadTeacherData();
                        }
                        else
                        {
                            MessageBox.Show("Update failed. Please check if the teacher ID exists.");
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Catch SQL-specific errors
                MessageBox.Show("SQL Error: " + sqlEx.Message);
            }
            catch (Exception ex)
            {
                // Catch other general exceptions
                MessageBox.Show("An error occurred: " + ex.Message);
            }

        }

        private void button4_Click(object sender, EventArgs e)
        {
            // Get the student ID from the form field
            string teacherID = textteacherid.Text;

            // Ask for confirmation before deletion
            DialogResult dialogResult = MessageBox.Show("Are you sure you want to delete this teacher?", "Confirmation", MessageBoxButtons.YesNo);

            if (dialogResult == DialogResult.Yes)
            {
                string query = "DELETE FROM Teacher WHERE Teacher_ID = @teacherID";


                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);

                // Open connection, execute query, and close connection
                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();

                MessageBox.Show("teacher deleted successfully!");


                // Refresh DataGridView after deletion
                LoadTeacherData();
            }
        }
    }
}
