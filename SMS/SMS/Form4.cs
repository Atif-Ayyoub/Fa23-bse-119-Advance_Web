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
using System.Windows.Forms.DataVisualization.Charting;



namespace SMS
{
    public partial class Form4 : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");
        public Form4()
        {
            
            InitializeComponent();
            LoadData();
            LoadTotalFees();
        }
        private void LoadOverallAttendanceChart()
        {
            try
            {
                string query = @"
            SELECT 
                COUNT(CASE WHEN Status = 'Present' THEN 1 END) AS PresentCount,
                COUNT(CASE WHEN Status = 'Absent' THEN 1 END) AS AbsentCount
            FROM Attendance";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.Read())
                    {
                        int presentCount = Convert.ToInt32(reader["PresentCount"]);
                        int absentCount = Convert.ToInt32(reader["AbsentCount"]);

                        chart1.Series.Clear();
                        chart1.Titles.Clear();
                        chart1.Titles.Add("School Attendance Summary");

                        Series series = new Series
                        {
                            ChartType = SeriesChartType.Pie
                        };

                        series.Points.AddXY("Present", presentCount);
                        series.Points.AddXY("Absent", absentCount);
                        series.IsValueShownAsLabel = true;
                        series.Label = "#PERCENT{P1}";

                        series.Points[0].Color = Color.MidnightBlue;
                        series.Points[1].Color = Color.DarkGray;
                        foreach (DataPoint point in series.Points)
                        {
                            point.LabelForeColor = Color.White; // Set the label text color to white
                        }


                        // Add the series to the chart without specifying a legend name
                        chart1.Series.Add(series);
                    }

                    reader.Close();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error: " + ex.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
        }

        private void LoadTotalFees()
        {
            try
            {
                // SQL Query to calculate total fees
                string query = "SELECT SUM(FEE_Amount) FROM Fee";

                // Create a connection to the database
                using (SqlConnection con = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True "))
                {
                    con.Open();

                    // Execute the query
                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        var result = cmd.ExecuteScalar();

                        // Check if result is not null
                        if (result != DBNull.Value && result != null)
                        {
                            // Display the total fee in the label
                            fees.Text = result.ToString();
                        }
                        else
                        {
                            // Display 0 if no fees exist
                            fees.Text = "0";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error loading total fees: " + ex.Message);
            }
        }
    

    private void LoadData()
        {

            // Display the total students and teachers in the respective labels
            enrolledstudents.Text = GetTotalCount("Student").ToString();
            enrolledteachers.Text = GetTotalCounts("Teacher").ToString();
            classes.Text = GetsTotalCounts("Class").ToString();
            


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
        private int GetsTotalCounts(string Class)
        {
            int count = 0;
            string query = $"SELECT COUNT(*) FROM {Class};";



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

        private void panel1_Paint(object sender, PaintEventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {

        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void button3_Click(object sender, EventArgs e)
        {
           
            Form1 f1 = new Form1();
            f1.Show();
            this.Hide();

        }

        private void button6_Click(object sender, EventArgs e)
        {

        }

        private void Form4_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'school_Management_SystemDataSet5.Class' table. You can move, or remove it, as needed.
            this.classTableAdapter1.Fill(this.school_Management_SystemDataSet5.Class);
            // TODO: This line of code loads data into the 'school_Management_SystemDataSet.Class' table. You can move, or remove it, as needed.
            this.classTableAdapter.Fill(this.school_Management_SystemDataSet.Class);
            LoadOverallAttendanceChart();

        }


        private void button5_Click(object sender, EventArgs e)
        {

        }

        private void button3_Click_1(object sender, EventArgs e)
        {
            Form5 f5 = new Form5();
            f5.Show();
            this.Hide();
        }

        private void label3_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void button4_Click(object sender, EventArgs e)
        {
            DialogResult check = MessageBox.Show("Are you sure u want to log out?", "Confirmation Message", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (check == DialogResult.Yes)
            {
                Form2 f2 = new Form2();
                f2.Show();
                this.Hide();
            }
        }

        private void button1_Click_1(object sender, EventArgs e)
        {
            Form7 f7 = new Form7();
            f7.Show();
            this.Hide();
        }

        private void button2_Click_1(object sender, EventArgs e)
        {
            Form1 f1 = new Form1();
            f1.Show();
            this.Hide();
        }

        private void label4_Click(object sender, EventArgs e)
        {
            Form6 f6 = new Form6();
            f6.Show();
            this.Hide();
        }

        private void label5_Click(object sender, EventArgs e)
        {

            Form8 f8 = new Form8();
            f8.Show();
            this.Hide();
        }

        private void enrolledstudents_Click(object sender, EventArgs e)
        {

        }

        private void panel3_Paint(object sender, PaintEventArgs e)
        {

        }

        private void button1_Click_2(object sender, EventArgs e)
        {
            fee f7 = new fee();
            f7.Show();
            this.Hide();
        }

        private void label7_Click(object sender, EventArgs e)
        {
           classes f7 = new classes();
            f7.Show();
            this.Hide();
        }

        private void panel4_Paint(object sender, PaintEventArgs e)
        {

        }

        private void panel5_Paint(object sender, PaintEventArgs e)
        {

        }

        private void button6_Click_1(object sender, EventArgs e)
        {
            attendance01 a1 = new attendance01();
            a1.Show();
            this.Hide();
        }

        private void panel7_Paint(object sender, PaintEventArgs e)
        {

        }

        private void chart1_Click(object sender, EventArgs e)
        {

        }
    }
}
