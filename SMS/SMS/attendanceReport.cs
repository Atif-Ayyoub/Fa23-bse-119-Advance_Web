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
using System.Drawing.Printing;



namespace SMS
{
    public partial class attendanceReport : Form
    {
        SqlConnection conn = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True ");
        public attendanceReport()
        {
            InitializeComponent();
        }
        private void LoadAttendanceData(string className, DateTime date)
        {
            try
            {
                // SQL query to fetch attendance for the selected class and date
                string query = @"
            SELECT StudentID, StudentName, Status 
            FROM Attendance 
            WHERE Class = @Class AND Date = @Date";

                using (SqlConnection con = new SqlConnection(@"Data Source=LAPTOP-Q2DTK1AG;Initial Catalog=School_Management_System;Integrated Security=True "))
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        // Add parameters to the query
                        cmd.Parameters.AddWithValue("@Class", className);
                        cmd.Parameters.AddWithValue("@Date", date);

                        // Load the data into a DataTable
                        DataTable dt = new DataTable();
                        using (SqlDataAdapter adapter = new SqlDataAdapter(cmd))
                        {
                            adapter.Fill(dt);
                        }

                        // Bind the DataTable to the DataGridView
                        dataGridView1.DataSource = dt;
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error loading attendance: " + ex.Message);
            }
        }
        private PrintDocument printDocument = new PrintDocument();

        private void ExportToPDFWithoutLibrary(string className, DateTime date)
        {
            // Attach an event handler to print the content
            printDocument.PrintPage += (sender, e) =>
            {
                // Define the header
                Font headerFont = new Font("Arial", 14, FontStyle.Bold);
                e.Graphics.DrawString($"Attendance Report for Class: {className}", headerFont, Brushes.Black, new Point(100, 50));
                e.Graphics.DrawString($"Date: {date.ToShortDateString()}", headerFont, Brushes.Black, new Point(100, 80));
                e.Graphics.DrawString("\n\n", headerFont, Brushes.Black, new Point(100, 110));

                // Define the table layout
                Font tableFont = new Font("Arial", 10);
                int startY = 150; // Y position for table
                int startX = 100; // X position for table
                int cellHeight = 30; // Height of each cell

                // Draw table headers
                foreach (DataGridViewColumn column in dataGridView1.Columns)
                {
                    e.Graphics.DrawString(column.HeaderText, tableFont, Brushes.Black, startX, startY);
                    startX += 100; // Increment X for next column
                }

                startY += cellHeight; // Move to next row
                startX = 100; // Reset X position

                // Draw rows
                foreach (DataGridViewRow row in dataGridView1.Rows)
                {
                    foreach (DataGridViewCell cell in row.Cells)
                    {
                        if (cell.Value != null)
                        {
                            e.Graphics.DrawString(cell.Value.ToString(), tableFont, Brushes.Black, startX, startY);
                        }
                        startX += 100; // Increment X for next cell
                    }

                    startY += cellHeight; // Increment Y for the next row
                    startX = 100; // Reset X position
                }
            };

            // Open Save File Dialog to Save as PDF
            SaveFileDialog saveFileDialog = new SaveFileDialog
            {
                Filter = "PDF Files (*.pdf)|*.pdf",
                Title = "Save Attendance Report"
            };

            if (saveFileDialog.ShowDialog() == DialogResult.OK)
            {
                printDocument.PrinterSettings.PrinterName = "Microsoft Print to PDF";
                printDocument.PrinterSettings.PrintToFile = true;
                printDocument.PrinterSettings.PrintFileName = saveFileDialog.FileName;

                // Print the document
                printDocument.Print();
                MessageBox.Show("PDF Report Generated Successfully!");
            }
        }

        private void attendanceReport_Load(object sender, EventArgs e)
        {
            // TODO: This line of code loads data into the 'school_Management_SystemDataSet8.Class' table. You can move, or remove it, as needed.
            this.classTableAdapter.Fill(this.school_Management_SystemDataSet8.Class);

        }

        private void button1_Click(object sender, EventArgs e)
        {
            string selectedClass = comboBox1.SelectedItem.ToString();
            DateTime selectedDate = dateTimePicker1.Value;

           
            LoadAttendanceData(selectedClass, selectedDate);
        }

        private void printDocument1_PrintPage(object sender, PrintPageEventArgs e)
        {

        }
    }
}
