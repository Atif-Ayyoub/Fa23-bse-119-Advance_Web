using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;




namespace SMS
{
    public partial class Form7 : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");
        public Form7()
        {
            InitializeComponent();
            LoadData();
        }
        private void LoadData()
        {

            // Display the total students and teachers in the respective labels
             enrolledstudents.Text = GetTotalCount("Student").ToString();
             enrolledteachers.Text = GetTotalCounts("Teacher").ToString();


        }
        private int GetTotalCount(string Student)
        {
            int count = 0;
            string query = $"SELECT COUNT(*) FROM {Student};";

            
            
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    try
                    {
                        conn.Open();
                        count = (int)cmd.ExecuteScalar();  // Get the count result
                        conn.Close();
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show($"Error: {ex.Message}");
                    }
                }
            
            return count;
        }
        private int GetTotalCounts(string Teacher)
        {
            int count = 0;
            string query = $"SELECT COUNT(*) FROM {Teacher};";



            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                try
                {
                    conn.Open();
                    count = (int)cmd.ExecuteScalar();  // Get the count result
                    conn.Close();
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error: {ex.Message}");
                }
            }

            return count;
        }
        private void panel2_Paint(object sender, PaintEventArgs e)
        {
           
        }

        private void enrolledstudents_Click(object sender, EventArgs e)
        {
            
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Form6 f6 = new Form6();
            f6.Show();
            this.Hide();
        }

        private void panel4_Paint(object sender, PaintEventArgs e)
        {

        }

        private void label5_Click(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            Form8 f8 = new Form8();
            f8.Show();
            this.Hide();
        }
    }
}
