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
using System.Data.Sql;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;




namespace SMS
{
    public partial class fee : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");
        public fee()
        {
            InitializeComponent();
        }

        private void fee_Load(object sender, EventArgs e)
        {

        }

        private void panel2_Paint(object sender, PaintEventArgs e)
        {

        }

        private void textBox2_TextChanged(object sender, EventArgs e)
        {

        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void panel3_Paint(object sender, PaintEventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            // Get Student ID from the textbox
            int studentId;
            if (!int.TryParse(rollno.Text, out studentId))
            {
                MessageBox.Show("Please enter a valid Student Roll No.");
                return;
            }

            // SQL query to fetch data, considering Class_ID instead of Class_Name
            string query = @"
    SELECT 
        s.Student_ID,
        s.Student_Name,
        s.Father_Name,
        s.Address,
        s.Date_of_Birth,
        s.Gender,
        s.Email,
        s.Contact_no,
        c.Class_Name AS Class, -- Retrieve the class name via a join with the Class table
        f.Fee_Amount,
        f.Due_Date,
        f.Status
    FROM 
        Student s
    JOIN 
        Fee f ON s.Student_ID = f.Student_ID
    JOIN 
        Class c ON s.Class_ID = c.Class_ID -- Join to get the Class name
    WHERE 
        s.Student_ID = @Student_ID";

            using (SqlConnection connection = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True"))
            {
                try
                {
                    connection.Open();

                    SqlCommand command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@Student_ID", studentId);

                    SqlDataReader reader = command.ExecuteReader();

                    if (reader.Read())
                    {
                        // Populate textboxes with fetched data
                        textstuentid.Text = reader["Student_ID"].ToString();
                        txtstudentname.Text = reader["Student_Name"].ToString();
                        textfathername.Text = reader["Father_Name"].ToString();
                        textadress.Text = reader["Address"].ToString();
                        textdob.Text = Convert.ToDateTime(reader["Date_of_Birth"]).ToShortDateString();
                        if (reader["Gender"].ToString() == "Male")
                        {
                            textmale.Checked = true;
                        }
                        else
                        {
                            textfemale.Checked = true;
                        }
                        textclass.Text = reader["Class"].ToString(); // Class name retrieved via join
                        textemail.Text = reader["Email"].ToString();
                        textcontact.Text = reader["Contact_no"].ToString();
                        textfee.Text = reader["Fee_Amount"].ToString();
                        dateTimePicker1.Value = Convert.ToDateTime(reader["Due_Date"]);
                        textstatus.Text = reader["Status"].ToString();
                    }
                    else
                    {
                        MessageBox.Show("No record found for the entered Student Roll No.");
                    }

                    reader.Close();
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Error: " + ex.Message);
                }
            }
        }


        private void button2_Click(object sender, EventArgs e)
        {
            
                // Validate inputs
                if (string.IsNullOrWhiteSpace(textstuentid.Text) ||
                    string.IsNullOrWhiteSpace(txtstudentname.Text) ||
                    string.IsNullOrWhiteSpace(textfee.Text) ||
                    string.IsNullOrWhiteSpace(textstatus.Text))
                {
                    MessageBox.Show("Please fill all the required fields before updating.", "Validation Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                // Parse inputs
                int studentId = int.Parse(textstuentid.Text);
                decimal feeAmount;
                if (!decimal.TryParse(textfee.Text, out feeAmount))
                {
                    MessageBox.Show("Invalid fee amount. Please enter a numeric value.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                string status = textstatus.Text;
                DateTime dueDate;
                if (!DateTime.TryParse(dateTimePicker1.Text, out dueDate))
                {
                    MessageBox.Show("Invalid due date format. Please select a valid date.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                // Update SQL query
                string updateQuery = @"
        UPDATE fee
        SET 
            Fee_Amount = @Fee_Amount,
            Due_Date = @Due_Date,
            Status = @Status
        WHERE 
            Student_ID = @Student_ID";

                try
                {
                    using (SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True"))
                    {
                        conn.Open();
                        using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                        {
                            // Add parameters to avoid SQL injection
                            cmd.Parameters.AddWithValue("@Fee_Amount", feeAmount);
                            cmd.Parameters.AddWithValue("@Due_Date", dueDate);
                            cmd.Parameters.AddWithValue("@Status", status);
                            cmd.Parameters.AddWithValue("@Student_ID", studentId);

                            int rowsAffected = cmd.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Fee details updated successfully!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                            }
                            else
                            {
                                MessageBox.Show("No record found for the given Student ID.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("An error occurred while updating the fee details: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            

        }

        private void label12_Click(object sender, EventArgs e)
        {

        }

        private void button3_Click(object sender, EventArgs e)
        {
           
                // Fetch details of the student
                string studentID = textstuentid.Text;
                string studentName = txtstudentname.Text;
                string fatherName = textfathername.Text;
                string address = textadress.Text;
                string contactNo = textcontact.Text;
                string studentClass = textclass.Text;
                string feeAmount = textfee.Text;
                string dueDate = dateTimePicker1.Text;
                string paymentDate = dateTimePicker2.Text;

                // Open the Fee Voucher form and pass the details
                fee2 voucherForm = new fee2(studentID, studentName, fatherName, address, contactNo, studentClass, feeAmount, dueDate, paymentDate);
                voucherForm.ShowDialog();
            


        }

        private void label4_Click(object sender, EventArgs e)
        {
            Form4 f8 = new Form4();
            f8.Show();
            this.Hide();
        }

        private void panel4_Paint(object sender, PaintEventArgs e)
        {

        }
    }




}
    

