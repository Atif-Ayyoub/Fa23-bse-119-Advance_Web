using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SMS
{
    public partial class Form3 : Form
    {
        public Form3()
        {
            InitializeComponent();
            
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            panel2.Width += 6;
            if(panel2.Width>= 742)
            {
                timer1.Stop();
                Form2 f2 = new Form2();
                f2.Show();
                this.Hide();

            }
        }
    }
}
