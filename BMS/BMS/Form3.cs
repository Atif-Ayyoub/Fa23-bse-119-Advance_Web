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
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace BMS
{
    public partial class Form3 : Form
    {
        public Form3()
        {
            InitializeComponent();
        }

        private void dateTimePicker1_ValueChanged(object sender, EventArgs e)
        {
            dateTimePicker1.CustomFormat = "dd/MM/yyyy";
        }

        private void dateTimePicker1_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Back)
            {
                dateTimePicker1.CustomFormat = "";

            }
        }

        private void button3_Click(object sender, EventArgs e)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True"))
                {
                    conn.Open();

                    SqlCommand cmd = new SqlCommand("INSERT INTO [Loan] (Loan_ID, Loan_Type, Amount, Interest_Rate, Loan_Date, Customer_Name) VALUES (@Loan_ID, @Loan_Type, @Amount, @Interest_Rate, @Loan_Date, @Customer_Name)", conn);

                    cmd.Parameters.AddWithValue("@Loan_ID", int.Parse(textBox1.Text));
                    cmd.Parameters.AddWithValue("@Loan_Type", textBox2.Text);
                    cmd.Parameters.AddWithValue("@Amount", int.Parse(textBox3.Text));
                    cmd.Parameters.AddWithValue("@Interest_Rate", textBox4.Text);
                    cmd.Parameters.AddWithValue("@Loan_Date", dateTimePicker1.Value);
                    cmd.Parameters.AddWithValue("@Customer_Name", textBox5.Text);

                    cmd.ExecuteNonQuery();
                }

                MessageBox.Show("Loan record saved successfully!");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred: {ex.Message}");
            }
        


    }

        private void button2_Click(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            conn.Open();
            SqlCommand cnn = new SqlCommand("select* from [Loan]", conn);
            SqlDataAdapter da = new SqlDataAdapter(cnn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            dataGridView1.DataSource = dt;
        }

        private void button5_Click(object sender, EventArgs e)
        {

            if (!int.TryParse(textBox1.Text, out _))
            {
                MessageBox.Show("Please enter a valid numeric value for Loan ID.");
                return;
            }

            if (!int.TryParse(textBox3.Text, out _))
            {
                MessageBox.Show("Please enter a valid numeric value for Amount.");
                return;
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True"))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("UPDATE [Loan] SET Loan_Type = @Loan_Type, Amount = @Amount, Interest_Rate = @Interest_Rate, Loan_Date = @Loan_Date, Customer_Name = @Customer_Name WHERE Loan_ID = @Loan_ID", conn);
                    cmd.Parameters.AddWithValue("@Loan_ID", int.Parse(textBox1.Text));
                    cmd.Parameters.AddWithValue("@Loan_Type", textBox2.Text);
                    cmd.Parameters.AddWithValue("@Amount", int.Parse(textBox3.Text));
                    cmd.Parameters.AddWithValue("@Interest_Rate", textBox4.Text); // Allows any text, including %
                    cmd.Parameters.AddWithValue("@Loan_Date", dateTimePicker1.Value);
                    cmd.Parameters.AddWithValue("@Customer_Name", textBox5.Text);

                    cmd.ExecuteNonQuery();
                }

                MessageBox.Show("Record updated successfully!");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred: {ex.Message}");
            }
        }
    
        private void button4_Click(object sender, EventArgs e)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True"))
                {
                    conn.Open();
                    SqlCommand cmd = new SqlCommand("DELETE FROM [Loan] WHERE Loan_ID = @Loan_ID", conn); // Corrected SQL command
                    cmd.Parameters.AddWithValue("@Loan_ID", int.Parse(textBox1.Text)); // Ensure correct data type
                    cmd.ExecuteNonQuery();
                }

                MessageBox.Show("Record deleted successfully!");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"An error occurred: {ex.Message}");
            }
        }

        private void Form3_Load(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            conn.Open();
            SqlCommand cnn = new SqlCommand("select* from [Loan]", conn);
            SqlDataAdapter da = new SqlDataAdapter(cnn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            dataGridView1.DataSource = dt;
            button2_Click(sender, e);
        }
    }
}
