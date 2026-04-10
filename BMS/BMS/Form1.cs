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

namespace BMS
{
    public partial class Form1 : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
        public Form1()
        {

            InitializeComponent();
        }

        private void label3_Click(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            // Check if the username and password fields are empty
            if (string.IsNullOrEmpty(usertxt.Text) || string.IsNullOrEmpty(passtxt.Text))
            {
                MessageBox.Show("Please enter username and password", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            try
            {
                conn.Open();

                // Use parameterized query to prevent SQL injection
                string qry = "INSERT INTO Login (UserName, password) VALUES (@UserName, @Password)";
                using (SqlCommand cmd = new SqlCommand(qry, conn))
                {
                    cmd.Parameters.AddWithValue("@UserName", usertxt.Text);
                    cmd.Parameters.AddWithValue("@Password", passtxt.Text);
                    cmd.ExecuteNonQuery();
                }

                MessageBox.Show("Login Successfully!");

                // Clear the text fields after successful insertion
                usertxt.Text = "";
                passtxt.Text = "";

                // Load the new form and hide the current one
                Loading_Form loading_Form = new Loading_Form();
                this.Hide();
                loading_Form.Show();
            }
            catch (Exception ex)
            {
                MessageBox.Show("An error occurred: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                // Ensure the connection is closed even if an exception occurs
                conn.Close();
            }
        }
    }
}
