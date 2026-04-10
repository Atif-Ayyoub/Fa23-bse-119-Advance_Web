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
using System.Data.SqlClient;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace BMS
{
    public partial class Transaction : Form
    {
        public Transaction()
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
            {
                string Transaction_Type = textBox2.Text.Trim();
                int Amount;
                int Account_ID;

                // Validate Amount and Account_ID inputs as integers
                if (!int.TryParse(textBox3.Text, out Amount) || !int.TryParse(textBox4.Text, out Account_ID))
                {
                    MessageBox.Show("Please enter valid integer values for Amount and Account ID.");
                    return;
                }

                using (SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True"))
                {
                    conn.Open();

                    // Begin a database transaction
                    SqlTransaction sqlTransaction = conn.BeginTransaction();
                    try
                    {
                        // Insert the transaction record
                        SqlCommand cmd = new SqlCommand("INSERT INTO [Transaction] (TID, Transaction_Type, Amount, Transaction_date, Account_ID) VALUES (@TID, @Transaction_Type, @Amount, @Transaction_date, @Account_ID)", conn, sqlTransaction);
                        cmd.Parameters.Add("@TID", SqlDbType.Int).Value = int.Parse(textBox1.Text); // Assuming TID is also an int
                        cmd.Parameters.Add("@Transaction_Type", SqlDbType.NVarChar, 50).Value = Transaction_Type;
                        cmd.Parameters.Add("@Amount", SqlDbType.Int).Value = Amount;  // Set Amount as INT
                        cmd.Parameters.Add("@Transaction_date", SqlDbType.DateTime).Value = dateTimePicker1.Value;
                        cmd.Parameters.Add("@Account_ID", SqlDbType.Int).Value = Account_ID; // Set Account_ID as INT
                        cmd.ExecuteNonQuery();

                        // Update account balance based on the transaction type
                        string updateBalanceQuery;
                        if (Transaction_Type.Equals("Withdraw", StringComparison.OrdinalIgnoreCase))
                        {
                            updateBalanceQuery = "UPDATE Account SET Balance = Balance - @Amount WHERE Account_ID = @Account_ID";
                        }
                        else if (Transaction_Type.Equals("Deposit", StringComparison.OrdinalIgnoreCase))
                        {
                            updateBalanceQuery = "UPDATE Account SET Balance = Balance + @Amount WHERE Account_ID = @Account_ID";
                        }
                        else
                        {
                            MessageBox.Show("Invalid transaction type. Please enter 'Withdraw' or 'Deposit'.");
                            return;
                        }

                        SqlCommand balanceCmd = new SqlCommand(updateBalanceQuery, conn, sqlTransaction);
                        balanceCmd.Parameters.Add("@Amount", SqlDbType.Int).Value = Amount; // Set Amount as INT
                        balanceCmd.Parameters.Add("@Account_ID", SqlDbType.Int).Value = Account_ID; // Set Account_ID as INT
                        balanceCmd.ExecuteNonQuery();

                        // Commit the transaction
                        sqlTransaction.Commit();

                        MessageBox.Show("Transaction completed and balance updated successfully!");
                    }
                    catch (Exception ex)
                    {
                        // Rollback the transaction if any error occurs
                        sqlTransaction.Rollback();
                        MessageBox.Show("Error: " + ex.Message);
                    }
                }
            }
        }


        private void button2_Click(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            conn.Open();
            SqlCommand cnn = new SqlCommand("select* from [Transaction]", conn);
            SqlDataAdapter da = new SqlDataAdapter(cnn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            dataGridView1.DataSource = dt;
        }

        private void button5_Click(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            conn.Open();
            SqlCommand cnn = new SqlCommand("update [Transaction] set Transacction_Type = @Transaction_Type, Amount = @Amount, Transaction_date = @Transaction_date,Account_ID = @Account_ID where TID = @TID ", conn);

            cnn.Parameters.AddWithValue("@TID", textBox1.Text);
            cnn.Parameters.AddWithValue("@Transaction_Type", textBox2.Text);
            cnn.Parameters.AddWithValue("@Amount", textBox3.Text);
            cnn.Parameters.AddWithValue("@Transaction_date", dateTimePicker1.Value.ToString("yyyy-MM-dd"));
            cnn.Parameters.AddWithValue("@Account_ID", textBox4.Text);

            cnn.ExecuteNonQuery();
            conn.Close();
            MessageBox.Show("Record Update Successfully! ");
        }

        private void button4_Click(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");

            conn.Open();
            SqlCommand cnn = new SqlCommand("delete Transaction where TID = @TID", conn);
            cnn.Parameters.AddWithValue("@Account_ID", textBox1.Text);
            cnn.ExecuteNonQuery();
            conn.Close();
            MessageBox.Show("Record Deleted Successfully! ");
        }

        private void Transaction_Load(object sender, EventArgs e)
        {
            SqlConnection conn = new SqlConnection(@"Data Source=ATIF;Initial Catalog=Bank_Management_System;Integrated Security=True");
            conn.Open();
            SqlCommand cnn = new SqlCommand("select* from [Transaction]", conn);
            SqlDataAdapter da = new SqlDataAdapter(cnn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            dataGridView1.DataSource = dt;
        }

        private void textBox2_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
