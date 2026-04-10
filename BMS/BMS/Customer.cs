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
    public partial class Customer : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
        public Customer()
        {
            InitializeComponent();
        }
        private void RefreshDataGridView()
        {
            if (conn.State == ConnectionState.Closed) conn.Open();
            SqlCommand cnn = new SqlCommand("SELECT * FROM [Customer]", conn);
            SqlDataAdapter da = new SqlDataAdapter(cnn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            dataGridView1.DataSource = dt;
            conn.Close();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (conn.State == ConnectionState.Closed) conn.Open();
            SqlCommand cnn = new SqlCommand("insert into [Customer] values (@Customer_ID,@Customer_Name,@Phone,@Email,@Address)", conn);
            cnn.Parameters.AddWithValue("@Customer_ID",int.Parse(textBox1.Text));

            cnn.Parameters.AddWithValue("@Customer_Name", textBox2.Text);
            cnn.Parameters.AddWithValue("@Phone", textBox3.Text);
            cnn.Parameters.AddWithValue("@Email", textBox4.Text);
            cnn.Parameters.AddWithValue("@Address", textBox5.Text);


            cnn.ExecuteNonQuery();  
            conn.Close();
            MessageBox.Show("Record Save Successfully! ");
           
        }

        private void button2_Click(object sender, EventArgs e)
        {
            if (conn.State == ConnectionState.Closed) conn.Open();
            SqlCommand cnn = new SqlCommand("select* from [Customer]", conn);
           SqlDataAdapter da = new SqlDataAdapter(cnn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            dataGridView1.DataSource = dt;
            RefreshDataGridView();

        }

        private void button3_Click(object sender, EventArgs e)
        {
            if (conn.State == ConnectionState.Closed) conn.Open();
            SqlCommand cnn = new SqlCommand("UPDATE [Customer] SET Customer_Name = @Customer_Name, Phone = @Phone, Email = @Email, Address = @Address WHERE Customer_ID = @Customer_ID", conn);

            cnn.Parameters.AddWithValue("@Customer_ID", int.Parse(textBox1.Text));
            cnn.Parameters.AddWithValue("@Customer_Name", textBox2.Text);
            cnn.Parameters.AddWithValue("@Phone", textBox3.Text);
            cnn.Parameters.AddWithValue("@Email", textBox4.Text);
            cnn.Parameters.AddWithValue("@Address", textBox5.Text);

            cnn.ExecuteNonQuery();
            conn.Close();
            MessageBox.Show("Record Updated Successfully!");
            RefreshDataGridView();

        }

        private void button4_Click(object sender, EventArgs e)
        {
            if (conn.State == ConnectionState.Closed) conn.Open();
            SqlCommand cnn = new SqlCommand("delete Customer where Customer_ID = @Customer_ID", conn);
            cnn.Parameters.AddWithValue("@Customer_ID", int.Parse(textBox1.Text));
            cnn.ExecuteNonQuery();
            conn.Close();
            MessageBox.Show("Record Deleted Successfully! ");
            RefreshDataGridView();


        }

        private void Customer_Load(object sender, EventArgs e)
        {
            if (conn.State == ConnectionState.Closed) conn.Open();
            SqlCommand cnn = new SqlCommand("select* from [Customer]", conn);
            SqlDataAdapter da = new SqlDataAdapter(cnn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            dataGridView1.DataSource = dt;
            RefreshDataGridView();
            dataGridView1.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
            dataGridView1.DefaultCellStyle.ForeColor = Color.Black;
            dataGridView1.DefaultCellStyle.BackColor = Color.White;
            dataGridView1.DefaultCellStyle.SelectionBackColor = Color.LightBlue;
            dataGridView1.DefaultCellStyle.SelectionForeColor = Color.Black;
            dataGridView1.ReadOnly = false;

            RefreshDataGridView();
        }

       

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            dataGridView1.ReadOnly = false;
        }
    }
}

