namespace SMS
{
    partial class Form8
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.Windows.Forms.DataGridViewCellStyle dataGridViewCellStyle1 = new System.Windows.Forms.DataGridViewCellStyle();
            this.dataGridView1 = new System.Windows.Forms.DataGridView();
            this.teacherIDDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.firstNameDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.lastNameDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.addressDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dateofBirthDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.contactnoDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.qualificationDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.genderDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.emailDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.dateOfJoiningDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.salaryDataGridViewTextBoxColumn = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.teacherBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.school_Management_SystemDataSet2 = new SMS.School_Management_SystemDataSet2();
            this.studentBindingSource = new System.Windows.Forms.BindingSource(this.components);
            this.school_Management_SystemDataSet1 = new SMS.School_Management_SystemDataSet1();
            this.studentTableAdapter = new SMS.School_Management_SystemDataSet1TableAdapters.StudentTableAdapter();
            this.panel1 = new System.Windows.Forms.Panel();
            this.label2 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.teacherTableAdapter = new SMS.School_Management_SystemDataSet2TableAdapters.TeacherTableAdapter();
            this.panel3 = new System.Windows.Forms.Panel();
            this.textdateofjoining = new System.Windows.Forms.TextBox();
            this.textsalary = new System.Windows.Forms.TextBox();
            this.label9 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.textqualification = new System.Windows.Forms.TextBox();
            this.button4 = new System.Windows.Forms.Button();
            this.button5 = new System.Windows.Forms.Button();
            this.label15 = new System.Windows.Forms.Label();
            this.textteacherid = new System.Windows.Forms.TextBox();
            this.textemail = new System.Windows.Forms.MaskedTextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.textfirstname = new System.Windows.Forms.TextBox();
            this.label18 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.textnumber = new System.Windows.Forms.TextBox();
            this.textaddress = new System.Windows.Forms.TextBox();
            this.label14 = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.label12 = new System.Windows.Forms.Label();
            this.textgender = new System.Windows.Forms.TextBox();
            this.textdob = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.textlastname = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.teacherBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.school_Management_SystemDataSet2)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.studentBindingSource)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.school_Management_SystemDataSet1)).BeginInit();
            this.panel1.SuspendLayout();
            this.panel3.SuspendLayout();
            this.SuspendLayout();
            // 
            // dataGridView1
            // 
            this.dataGridView1.AllowDrop = true;
            this.dataGridView1.AutoGenerateColumns = false;
            this.dataGridView1.BackgroundColor = System.Drawing.Color.White;
            this.dataGridView1.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView1.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.teacherIDDataGridViewTextBoxColumn,
            this.firstNameDataGridViewTextBoxColumn,
            this.lastNameDataGridViewTextBoxColumn,
            this.addressDataGridViewTextBoxColumn,
            this.dateofBirthDataGridViewTextBoxColumn,
            this.contactnoDataGridViewTextBoxColumn,
            this.qualificationDataGridViewTextBoxColumn,
            this.genderDataGridViewTextBoxColumn,
            this.emailDataGridViewTextBoxColumn,
            this.dateOfJoiningDataGridViewTextBoxColumn,
            this.salaryDataGridViewTextBoxColumn});
            this.dataGridView1.Cursor = System.Windows.Forms.Cursors.Default;
            this.dataGridView1.DataSource = this.teacherBindingSource;
            dataGridViewCellStyle1.Alignment = System.Windows.Forms.DataGridViewContentAlignment.MiddleLeft;
            dataGridViewCellStyle1.BackColor = System.Drawing.Color.White;
            dataGridViewCellStyle1.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            dataGridViewCellStyle1.ForeColor = System.Drawing.SystemColors.ControlText;
            dataGridViewCellStyle1.SelectionBackColor = System.Drawing.Color.DarkSlateGray;
            dataGridViewCellStyle1.SelectionForeColor = System.Drawing.SystemColors.HighlightText;
            dataGridViewCellStyle1.WrapMode = System.Windows.Forms.DataGridViewTriState.False;
            this.dataGridView1.DefaultCellStyle = dataGridViewCellStyle1;
            this.dataGridView1.GridColor = System.Drawing.Color.DarkSlateGray;
            this.dataGridView1.Location = new System.Drawing.Point(18, 108);
            this.dataGridView1.Name = "dataGridView1";
            this.dataGridView1.RowHeadersWidth = 51;
            this.dataGridView1.RowTemplate.Height = 24;
            this.dataGridView1.Size = new System.Drawing.Size(1151, 402);
            this.dataGridView1.TabIndex = 3;
            this.dataGridView1.CellContentClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dataGridView1_CellContentClick);
            // 
            // teacherIDDataGridViewTextBoxColumn
            // 
            this.teacherIDDataGridViewTextBoxColumn.DataPropertyName = "Teacher_ID";
            this.teacherIDDataGridViewTextBoxColumn.HeaderText = "Teacher_ID";
            this.teacherIDDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.teacherIDDataGridViewTextBoxColumn.Name = "teacherIDDataGridViewTextBoxColumn";
            this.teacherIDDataGridViewTextBoxColumn.Width = 125;
            // 
            // firstNameDataGridViewTextBoxColumn
            // 
            this.firstNameDataGridViewTextBoxColumn.DataPropertyName = "First_Name";
            this.firstNameDataGridViewTextBoxColumn.HeaderText = "First_Name";
            this.firstNameDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.firstNameDataGridViewTextBoxColumn.Name = "firstNameDataGridViewTextBoxColumn";
            this.firstNameDataGridViewTextBoxColumn.Width = 125;
            // 
            // lastNameDataGridViewTextBoxColumn
            // 
            this.lastNameDataGridViewTextBoxColumn.DataPropertyName = "Last_Name";
            this.lastNameDataGridViewTextBoxColumn.HeaderText = "Last_Name";
            this.lastNameDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.lastNameDataGridViewTextBoxColumn.Name = "lastNameDataGridViewTextBoxColumn";
            this.lastNameDataGridViewTextBoxColumn.Width = 125;
            // 
            // addressDataGridViewTextBoxColumn
            // 
            this.addressDataGridViewTextBoxColumn.DataPropertyName = "address";
            this.addressDataGridViewTextBoxColumn.HeaderText = "address";
            this.addressDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.addressDataGridViewTextBoxColumn.Name = "addressDataGridViewTextBoxColumn";
            this.addressDataGridViewTextBoxColumn.Width = 125;
            // 
            // dateofBirthDataGridViewTextBoxColumn
            // 
            this.dateofBirthDataGridViewTextBoxColumn.DataPropertyName = "Date_of_Birth";
            this.dateofBirthDataGridViewTextBoxColumn.HeaderText = "Date_of_Birth";
            this.dateofBirthDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.dateofBirthDataGridViewTextBoxColumn.Name = "dateofBirthDataGridViewTextBoxColumn";
            this.dateofBirthDataGridViewTextBoxColumn.Width = 125;
            // 
            // contactnoDataGridViewTextBoxColumn
            // 
            this.contactnoDataGridViewTextBoxColumn.DataPropertyName = "contactno";
            this.contactnoDataGridViewTextBoxColumn.HeaderText = "contactno";
            this.contactnoDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.contactnoDataGridViewTextBoxColumn.Name = "contactnoDataGridViewTextBoxColumn";
            this.contactnoDataGridViewTextBoxColumn.Width = 125;
            // 
            // qualificationDataGridViewTextBoxColumn
            // 
            this.qualificationDataGridViewTextBoxColumn.DataPropertyName = "qualification";
            this.qualificationDataGridViewTextBoxColumn.HeaderText = "qualification";
            this.qualificationDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.qualificationDataGridViewTextBoxColumn.Name = "qualificationDataGridViewTextBoxColumn";
            this.qualificationDataGridViewTextBoxColumn.Width = 125;
            // 
            // genderDataGridViewTextBoxColumn
            // 
            this.genderDataGridViewTextBoxColumn.DataPropertyName = "gender";
            this.genderDataGridViewTextBoxColumn.HeaderText = "gender";
            this.genderDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.genderDataGridViewTextBoxColumn.Name = "genderDataGridViewTextBoxColumn";
            this.genderDataGridViewTextBoxColumn.Width = 125;
            // 
            // emailDataGridViewTextBoxColumn
            // 
            this.emailDataGridViewTextBoxColumn.DataPropertyName = "email";
            this.emailDataGridViewTextBoxColumn.HeaderText = "email";
            this.emailDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.emailDataGridViewTextBoxColumn.Name = "emailDataGridViewTextBoxColumn";
            this.emailDataGridViewTextBoxColumn.Width = 125;
            // 
            // dateOfJoiningDataGridViewTextBoxColumn
            // 
            this.dateOfJoiningDataGridViewTextBoxColumn.DataPropertyName = "dateOfJoining";
            this.dateOfJoiningDataGridViewTextBoxColumn.HeaderText = "dateOfJoining";
            this.dateOfJoiningDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.dateOfJoiningDataGridViewTextBoxColumn.Name = "dateOfJoiningDataGridViewTextBoxColumn";
            this.dateOfJoiningDataGridViewTextBoxColumn.Width = 125;
            // 
            // salaryDataGridViewTextBoxColumn
            // 
            this.salaryDataGridViewTextBoxColumn.DataPropertyName = "salary";
            this.salaryDataGridViewTextBoxColumn.HeaderText = "salary";
            this.salaryDataGridViewTextBoxColumn.MinimumWidth = 6;
            this.salaryDataGridViewTextBoxColumn.Name = "salaryDataGridViewTextBoxColumn";
            this.salaryDataGridViewTextBoxColumn.Width = 125;
            // 
            // teacherBindingSource
            // 
            this.teacherBindingSource.DataMember = "Teacher";
            this.teacherBindingSource.DataSource = this.school_Management_SystemDataSet2;
            // 
            // school_Management_SystemDataSet2
            // 
            this.school_Management_SystemDataSet2.DataSetName = "School_Management_SystemDataSet2";
            this.school_Management_SystemDataSet2.SchemaSerializationMode = System.Data.SchemaSerializationMode.IncludeSchema;
            // 
            // studentBindingSource
            // 
            this.studentBindingSource.DataMember = "Student";
            this.studentBindingSource.DataSource = this.school_Management_SystemDataSet1;
            // 
            // school_Management_SystemDataSet1
            // 
            this.school_Management_SystemDataSet1.DataSetName = "School_Management_SystemDataSet1";
            this.school_Management_SystemDataSet1.SchemaSerializationMode = System.Data.SchemaSerializationMode.IncludeSchema;
            // 
            // studentTableAdapter
            // 
            this.studentTableAdapter.ClearBeforeFill = true;
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.Color.White;
            this.panel1.Controls.Add(this.label2);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(1202, 20);
            this.panel1.TabIndex = 5;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 7.8F, System.Drawing.FontStyle.Bold);
            this.label2.Location = new System.Drawing.Point(1180, 4);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(16, 16);
            this.label2.TabIndex = 3;
            this.label2.Text = "X";
            this.label2.Click += new System.EventHandler(this.label2_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 16.2F, System.Drawing.FontStyle.Bold);
            this.label1.ForeColor = System.Drawing.Color.White;
            this.label1.Location = new System.Drawing.Point(12, 52);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(212, 32);
            this.label1.TabIndex = 4;
            this.label1.Text = "Teachers Data";
            // 
            // teacherTableAdapter
            // 
            this.teacherTableAdapter.ClearBeforeFill = true;
            // 
            // panel3
            // 
            this.panel3.Controls.Add(this.textdateofjoining);
            this.panel3.Controls.Add(this.textsalary);
            this.panel3.Controls.Add(this.label9);
            this.panel3.Controls.Add(this.label7);
            this.panel3.Controls.Add(this.textqualification);
            this.panel3.Controls.Add(this.button4);
            this.panel3.Controls.Add(this.button5);
            this.panel3.Controls.Add(this.label15);
            this.panel3.Controls.Add(this.textteacherid);
            this.panel3.Controls.Add(this.textemail);
            this.panel3.Controls.Add(this.label3);
            this.panel3.Controls.Add(this.textfirstname);
            this.panel3.Controls.Add(this.label18);
            this.panel3.Controls.Add(this.label5);
            this.panel3.Controls.Add(this.textnumber);
            this.panel3.Controls.Add(this.textaddress);
            this.panel3.Controls.Add(this.label14);
            this.panel3.Controls.Add(this.label8);
            this.panel3.Controls.Add(this.label12);
            this.panel3.Controls.Add(this.textgender);
            this.panel3.Controls.Add(this.textdob);
            this.panel3.Controls.Add(this.label4);
            this.panel3.Controls.Add(this.textlastname);
            this.panel3.Controls.Add(this.label6);
            this.panel3.Location = new System.Drawing.Point(18, 558);
            this.panel3.Name = "panel3";
            this.panel3.Size = new System.Drawing.Size(1134, 503);
            this.panel3.TabIndex = 94;
            // 
            // textdateofjoining
            // 
            this.textdateofjoining.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textdateofjoining.Location = new System.Drawing.Point(258, 337);
            this.textdateofjoining.Name = "textdateofjoining";
            this.textdateofjoining.Size = new System.Drawing.Size(212, 34);
            this.textdateofjoining.TabIndex = 97;
            // 
            // textsalary
            // 
            this.textsalary.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textsalary.Location = new System.Drawing.Point(729, 337);
            this.textsalary.Name = "textsalary";
            this.textsalary.Size = new System.Drawing.Size(207, 34);
            this.textsalary.TabIndex = 96;
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label9.ForeColor = System.Drawing.Color.MintCream;
            this.label9.ImeMode = System.Windows.Forms.ImeMode.NoControl;
            this.label9.Location = new System.Drawing.Point(54, 337);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(186, 30);
            this.label9.TabIndex = 95;
            this.label9.Text = "Date Of Joining";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label7.ForeColor = System.Drawing.Color.MintCream;
            this.label7.ImeMode = System.Windows.Forms.ImeMode.NoControl;
            this.label7.Location = new System.Drawing.Point(543, 337);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(79, 30);
            this.label7.TabIndex = 94;
            this.label7.Text = "Salary";
            // 
            // textqualification
            // 
            this.textqualification.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textqualification.Location = new System.Drawing.Point(729, 212);
            this.textqualification.Name = "textqualification";
            this.textqualification.Size = new System.Drawing.Size(207, 34);
            this.textqualification.TabIndex = 93;
            // 
            // button4
            // 
            this.button4.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Bold);
            this.button4.Location = new System.Drawing.Point(896, 397);
            this.button4.Name = "button4";
            this.button4.Size = new System.Drawing.Size(123, 43);
            this.button4.TabIndex = 91;
            this.button4.Text = "Delete";
            this.button4.UseVisualStyleBackColor = true;
            this.button4.Click += new System.EventHandler(this.button4_Click);
            // 
            // button5
            // 
            this.button5.Font = new System.Drawing.Font("Microsoft Sans Serif", 10.8F, System.Drawing.FontStyle.Bold);
            this.button5.Location = new System.Drawing.Point(729, 397);
            this.button5.Name = "button5";
            this.button5.Size = new System.Drawing.Size(132, 43);
            this.button5.TabIndex = 92;
            this.button5.Text = "Update";
            this.button5.UseVisualStyleBackColor = true;
            this.button5.Click += new System.EventHandler(this.button5_Click);
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label15.ForeColor = System.Drawing.Color.MintCream;
            this.label15.Location = new System.Drawing.Point(54, 24);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(132, 30);
            this.label15.TabIndex = 60;
            this.label15.Text = "Teacher ID";
            // 
            // textteacherid
            // 
            this.textteacherid.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textteacherid.Location = new System.Drawing.Point(258, 24);
            this.textteacherid.Name = "textteacherid";
            this.textteacherid.Size = new System.Drawing.Size(212, 34);
            this.textteacherid.TabIndex = 69;
            // 
            // textemail
            // 
            this.textemail.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textemail.Location = new System.Drawing.Point(729, 280);
            this.textemail.Name = "textemail";
            this.textemail.Size = new System.Drawing.Size(207, 34);
            this.textemail.TabIndex = 87;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label3.ForeColor = System.Drawing.Color.MintCream;
            this.label3.Location = new System.Drawing.Point(54, 88);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(134, 30);
            this.label3.TabIndex = 61;
            this.label3.Text = "First Name";
            // 
            // textfirstname
            // 
            this.textfirstname.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textfirstname.Location = new System.Drawing.Point(258, 88);
            this.textfirstname.Name = "textfirstname";
            this.textfirstname.Size = new System.Drawing.Size(212, 34);
            this.textfirstname.TabIndex = 70;
            // 
            // label18
            // 
            this.label18.AutoSize = true;
            this.label18.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label18.ForeColor = System.Drawing.Color.MintCream;
            this.label18.Location = new System.Drawing.Point(539, 276);
            this.label18.Name = "label18";
            this.label18.Size = new System.Drawing.Size(83, 30);
            this.label18.TabIndex = 86;
            this.label18.Text = "E-mail";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label5.ForeColor = System.Drawing.Color.MintCream;
            this.label5.Location = new System.Drawing.Point(55, 144);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(103, 30);
            this.label5.TabIndex = 63;
            this.label5.Text = "Address";
            // 
            // textnumber
            // 
            this.textnumber.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textnumber.Location = new System.Drawing.Point(258, 212);
            this.textnumber.Name = "textnumber";
            this.textnumber.Size = new System.Drawing.Size(212, 34);
            this.textnumber.TabIndex = 85;
            // 
            // textaddress
            // 
            this.textaddress.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textaddress.Location = new System.Drawing.Point(258, 144);
            this.textaddress.Name = "textaddress";
            this.textaddress.Size = new System.Drawing.Size(212, 34);
            this.textaddress.TabIndex = 67;
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label14.ForeColor = System.Drawing.Color.MintCream;
            this.label14.Location = new System.Drawing.Point(54, 214);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(141, 30);
            this.label14.TabIndex = 84;
            this.label14.Text = "Contact No";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label8.ForeColor = System.Drawing.Color.MintCream;
            this.label8.Location = new System.Drawing.Point(55, 284);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(94, 30);
            this.label8.TabIndex = 66;
            this.label8.Text = "Gender";
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label12.ForeColor = System.Drawing.Color.MintCream;
            this.label12.Location = new System.Drawing.Point(539, 212);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(154, 30);
            this.label12.TabIndex = 72;
            this.label12.Text = "Qualification";
            // 
            // textgender
            // 
            this.textgender.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textgender.Location = new System.Drawing.Point(258, 276);
            this.textgender.Name = "textgender";
            this.textgender.Size = new System.Drawing.Size(212, 34);
            this.textgender.TabIndex = 73;
            // 
            // textdob
            // 
            this.textdob.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textdob.Location = new System.Drawing.Point(729, 146);
            this.textdob.Name = "textdob";
            this.textdob.Size = new System.Drawing.Size(207, 34);
            this.textdob.TabIndex = 82;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label4.ForeColor = System.Drawing.Color.MintCream;
            this.label4.Location = new System.Drawing.Point(539, 92);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(132, 30);
            this.label4.TabIndex = 62;
            this.label4.Text = "Last Name";
            // 
            // textlastname
            // 
            this.textlastname.Font = new System.Drawing.Font("Microsoft Sans Serif", 13.8F);
            this.textlastname.Location = new System.Drawing.Point(729, 92);
            this.textlastname.Name = "textlastname";
            this.textlastname.Size = new System.Drawing.Size(207, 34);
            this.textlastname.TabIndex = 68;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Microsoft YaHei", 13.8F);
            this.label6.ForeColor = System.Drawing.Color.MintCream;
            this.label6.Location = new System.Drawing.Point(539, 146);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(159, 30);
            this.label6.TabIndex = 64;
            this.label6.Text = "Date Of Birth";
            // 
            // Form8
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoScroll = true;
            this.BackColor = System.Drawing.Color.MidnightBlue;
            this.ClientSize = new System.Drawing.Size(1223, 1055);
            this.Controls.Add(this.panel3);
            this.Controls.Add(this.dataGridView1);
            this.Controls.Add(this.panel1);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Name = "Form8";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Form8";
            this.Load += new System.EventHandler(this.Form8_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.teacherBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.school_Management_SystemDataSet2)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.studentBindingSource)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.school_Management_SystemDataSet1)).EndInit();
            this.panel1.ResumeLayout(false);
            this.panel1.PerformLayout();
            this.panel3.ResumeLayout(false);
            this.panel3.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DataGridView dataGridView1;
        private System.Windows.Forms.BindingSource studentBindingSource;
        private School_Management_SystemDataSet1 school_Management_SystemDataSet1;
        private School_Management_SystemDataSet1TableAdapters.StudentTableAdapter studentTableAdapter;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label1;
        private School_Management_SystemDataSet2 school_Management_SystemDataSet2;
        private System.Windows.Forms.BindingSource teacherBindingSource;
        private School_Management_SystemDataSet2TableAdapters.TeacherTableAdapter teacherTableAdapter;
        private System.Windows.Forms.DataGridViewTextBoxColumn teacherIDDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn firstNameDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn lastNameDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn addressDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn dateofBirthDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn contactnoDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn qualificationDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn genderDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn emailDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn dateOfJoiningDataGridViewTextBoxColumn;
        private System.Windows.Forms.DataGridViewTextBoxColumn salaryDataGridViewTextBoxColumn;
        private System.Windows.Forms.Panel panel3;
        private System.Windows.Forms.TextBox textqualification;
        private System.Windows.Forms.Button button4;
        private System.Windows.Forms.Button button5;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.TextBox textteacherid;
        private System.Windows.Forms.MaskedTextBox textemail;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox textfirstname;
        private System.Windows.Forms.Label label18;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox textnumber;
        private System.Windows.Forms.TextBox textaddress;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.TextBox textgender;
        private System.Windows.Forms.TextBox textdob;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox textlastname;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.TextBox textdateofjoining;
        private System.Windows.Forms.TextBox textsalary;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Label label7;
    }
}