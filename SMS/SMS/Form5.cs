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



namespace SMS
{
   
    public partial class Form5 : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");
        public Form5()
        {
            InitializeComponent();
        }

        private void Form5_Load(object sender, EventArgs e)
        {

        }
        string gender;
        private void button1_Click(object sender, EventArgs e)
        {
            conn.Open();
            string qry = "insert into Teacher(Teacher_ID,First_Name,Last_Name,address,Date_of_Birth,contactno,qualification,gender,email,dateOfJoining,salary) values('" + textteacherid.Text + "','" + textteachername.Text + "','" + textfathername.Text + "','" + textaddress.Text + "','" + textdob.Text + "','"+ maskedTextphone.Text+"','" + txtqualification.Text + "','"+ gender + "','" + textemail.Text + "','"+textDOJ.Text+"','"+textsalary.Text+"')";
            SqlCommand cmd = new SqlCommand(qry, conn);
            cmd.ExecuteNonQuery();
            textteacherid.Text = " ";
            textteachername.Text = " ";
            textfathername.Text = "";
            textaddress.Text = " ";
            textdob.Text = " ";
            maskedTextphone.Text = " ";
            txtqualification.Text = " ";
            textemail.Text = " ";
            textDOJ.Text = " ";
            textsalary.Text = " ";
            MessageBox.Show("Registered Successfully!");
            conn.Close();
        }

        private void txtqualification_TextChanged(object sender, EventArgs e)
        {

        }

        private void label10_Click(object sender, EventArgs e)
        {

        }

        private void textgender_CheckedChanged(object sender, EventArgs e)
        {
            gender = "male";
        }

        private void radioButton3_CheckedChanged(object sender, EventArgs e)
        {
            gender = "Female";
        }

        private void label14_Click(object sender, EventArgs e)
        {
            Form4 f4 = new Form4();
            f4.Show();
            this.Hide();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            
        }

        private void button2_Click(object sender, EventArgs e)
        {
            Form4 f4 = new Form4();
            f4.Show();
            this.Hide();
        }

        private void label3_Click(object sender, EventArgs e)
        {

        }

        private void label5_Click(object sender, EventArgs e)
        {

        }

        private void label9_Click(object sender, EventArgs e)
        {

        }

        private void label8_Click(object sender, EventArgs e)
        {

        }

        private void label13_Click(object sender, EventArgs e)
        {

        }

        private void label11_Click(object sender, EventArgs e)
        {

        }

        private void label12_Click(object sender, EventArgs e)
        {

        }

        private void label6_Click(object sender, EventArgs e)
        {

        }

        private void label4_Click(object sender, EventArgs e)
        {

        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void panel3_Paint(object sender, PaintEventArgs e)
        {

        }

        private void label15_Click(object sender, EventArgs e)
        {
            Form4 f4 = new Form4();
            f4.Show();
            this.Hide();
        }
    }
}
