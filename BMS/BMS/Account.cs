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
    public partial class Account : Form
    {
        public Account()
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            InitializeComponent();
        }

     

        private void button3_Click(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            conn.Open();
            SqlCommand cnn = new SqlCommand("insert into [Account] values (@Account_Type,@Balance,@Date_open,@Customer_Name)", conn);
           
            cnn.Parameters.AddWithValue("@Account_Type", textBox2.Text);
            cnn.Parameters.AddWithValue("@Balance",textBox3.Text);
            cnn.Parameters.AddWithValue("@Date_Open", dateTimePicker1.Value);
            cnn.Parameters.AddWithValue("@Customer_Name",textBox5.Text);

            cnn.ExecuteNonQuery();
            conn.Close();
            MessageBox.Show("Record Save Successfully! ");
        }

        private void button2_Click(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            conn.Open();
            SqlCommand cnn = new SqlCommand("select* from [Account]", conn);
            SqlDataAdapter da = new SqlDataAdapter(cnn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            dataGridView1.DataSource = dt;
        }

        private void button5_Click(object sender, EventArgs e)

        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            conn.Open();
            SqlCommand cnn = new SqlCommand("update [Account] set Account_Type = @Account_Type, Balance = @Balance, Date_Open = @Date_Open, Customer_Name = @Customer_Name where Account_ID = @Account_ID", conn);

            cnn.Parameters.AddWithValue("@Account_ID", textBox6.Text);
            cnn.Parameters.AddWithValue("@Account_Type",textBox2.Text);
            cnn.Parameters.AddWithValue("@Balance",textBox3.Text);
            cnn.Parameters.AddWithValue("@Date_Open", dateTimePicker1.Value.ToString("yyyy-MM-dd"));
            cnn.Parameters.AddWithValue("@Customer_Name", textBox5.Text);

            cnn.ExecuteNonQuery();
            conn.Close();
            MessageBox.Show("Record Update Successfully! ");
        }

        private void button4_Click(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");

            conn.Open();
            SqlCommand cnn = new SqlCommand("delete Account where Account_ID = @Account_ID", conn);
            cnn.Parameters.AddWithValue("@Account_ID",textBox1.Text);
            cnn.ExecuteNonQuery();
            conn.Close();
            MessageBox.Show("Record Deleted Successfully! ");
        }
        private void Account_Load(object sender, EventArgs e)
        {
             
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            conn.Open();
            SqlCommand cnn = new SqlCommand("select* from [Account]", conn);
            SqlDataAdapter da = new SqlDataAdapter(cnn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            dataGridView1.DataSource = dt;
        }

        private void pictureBox1_Click(object sender, EventArgs e)
        {

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

        private void button1_Click(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            conn.Open();
            SqlCommand cnn = new SqlCommand("select* from [Account] where Customer_Name = @Customer_Name", conn);
            cnn.Parameters.AddWithValue("@Customer_Name",textBox1.Text);
       

            SqlDataAdapter da = new SqlDataAdapter(cnn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            conn.Close();
            dataGridView1.DataSource = dt;
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }

        private void panel2_Paint(object sender, PaintEventArgs e)
        {

        }
    }
}
