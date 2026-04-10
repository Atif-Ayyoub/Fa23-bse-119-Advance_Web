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
    public partial class fee2 : Form
    {

        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");
        public fee2(string studentID, string studentName, string fatherName, string address, string contactNo, string studentClass, string feeAmount, string dueDate, string paymentDate)
        {
            
                InitializeComponent();

                // Populate the fields for Student Copy
                studentid.Text = studentID;
                txtStudentName.Text = studentName;
                txtFatherName.Text = fatherName;
                txtAddress.Text = address;
                txtContactNo.Text = contactNo;
                classS.Text = studentClass;
                txtFeeAmount.Text = feeAmount;
                txtDueDate.Text = dueDate;
                txtPaymentDate.Text = paymentDate;

                // Populate the fields for Admin Copy
                studentidA.Text = studentID;
                txtStudentNameA.Text = studentName;
                txtFatherNameA.Text = fatherName;
                txtAddressA.Text = address;
                txtContactNoA.Text = contactNo;
                classA.Text = studentClass;
                txtFeeAmountA.Text = feeAmount;
                txtDueDateA.Text = dueDate;
                txtPaymentDateA.Text = paymentDate;

                // Populate the fields for Teacher Copy
                studentidT.Text = studentID;
                txtStudentNameT.Text = studentName;
                txtFatherNameT.Text = fatherName;
                txtAddressT.Text = address;
                txtContactNoT.Text = contactNo;
                classT.Text = studentClass;
                txtFeeAmountT.Text = feeAmount;
                txtDueDateT.Text = dueDate;
                txtPaymentDateT.Text = paymentDate;
            

          
        }
        private Bitmap CaptureForm()
        {
           
                // Temporarily hide controls that shouldn't be printed
                button1.Visible = false; // Hide the Print button (replace 'btnPrint' with your Print button's name)

                // Create a bitmap of the form
                Bitmap bitmap = new Bitmap(this.Width, this.Height);
                this.DrawToBitmap(bitmap, new Rectangle(0, 0, this.Width, this.Height));

                // Restore visibility of hidden controls
                button1.Visible = true; // Show the Print button again

                return bitmap;
            

        }


        private void panel3_Paint(object sender, PaintEventArgs e)
        {

        }

        private void panel3_Paint_1(object sender, PaintEventArgs e)
        {

        }

        private void fee2_Load(object sender, EventArgs e)
        {

        }

        private void label28_Click(object sender, EventArgs e)
        {

        }

        private void textBox2_TextChanged(object sender, EventArgs e)
        {

        }

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void panel7_Paint(object sender, PaintEventArgs e)
        {

        }

        private void printDocument1_PrintPage(object sender, System.Drawing.Printing.PrintPageEventArgs e)
        {
            
                Bitmap formImage = CaptureForm();
                e.Graphics.DrawImage(formImage, 0, 0, e.PageBounds.Width, e.PageBounds.Height);
            

        }

        private void button1_Click(object sender, EventArgs e)
        {
            
                PrintPreviewDialog previewDialog = new PrintPreviewDialog
                {
                    Document = printDocument1
                };

                if (previewDialog.ShowDialog() == DialogResult.OK)
                {
                    printDocument1.Print();
                }
            



        }

        private void panel2_Paint(object sender, PaintEventArgs e)
        {

        }

        private void label76_Click(object sender, EventArgs e)
        {
            fee c = new fee();
            c.Show();
            this.Hide();
        }

        private void label37_Click(object sender, EventArgs e)
        {

        }
    }
}
