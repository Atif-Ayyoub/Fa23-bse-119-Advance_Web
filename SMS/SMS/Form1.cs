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
    public partial class Form1 : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            Form4 f4 = new Form4();
            f4.Show();
            this.Hide();
        }
        string gender;
        private void button1_Click(object sender, EventArgs e)
        {
            conn.Open();
            string qry = "insert into Student(Student_ID,Student_Name,Father_Name,Address,Date_of_Birth,Gender,Gurdian_Name,Contact_no,Email) values('" + textstuentid.Text + "','" + textstudentname.Text + "','" + textfathername.Text + "','" + textaddress.Text + "','" + textdob.Text + "','" + gender+ "','" + textgname.Text + "','" + maskedTextphone.Text + "','" + textemail.Text + "')";
            SqlCommand cmd = new SqlCommand(qry, conn);
            cmd.ExecuteNonQuery();
            textstuentid.Text = " ";
            textstudentname.Text = " ";
            textfathername.Text = "";
            textaddress.Text = " ";
            textdob.Text = " ";
            textgender.Text = " ";
            textgname.Text = " ";
            maskedTextphone.Text = " ";
            textemail.Text = " ";
            
            MessageBox.Show("Registered Successfully!");
            conn.Close();
        }

        private void textDOB_ValueChanged(object sender, EventArgs e)
        {

        }

        private void textgender_CheckedChanged(object sender, EventArgs e)
        {
            gender = "male";
        }

        private void radioButton3_CheckedChanged(object sender, EventArgs e)
        {
            gender = "female";
        }

        private void label13_Click(object sender, EventArgs e)
        {
            Form4 f4 = new Form4();
            f4.Show();
            this.Hide();
        }

        private void label16_Click(object sender, EventArgs e)
        {
            Form4 f4 = new Form4();
            f4.Show();
            this.Hide();
        }
    }
}
