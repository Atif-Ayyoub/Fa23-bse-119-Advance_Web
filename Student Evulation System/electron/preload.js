const { contextBridge, ipcRenderer } = require('electron');

const api = {
  getStudents: (batchId) => ipcRenderer.invoke('db:getStudents', batchId),
  getBatches: () => ipcRenderer.invoke('db:getBatches'),
  createBatch: (name) => ipcRenderer.invoke('db:createBatch', name),
  getAssessments: () => ipcRenderer.invoke('db:getAssessments'),
  addStudent: (payload) => ipcRenderer.invoke('db:addStudent', payload),
  updateStudent: (payload) => ipcRenderer.invoke('db:updateStudent', payload),
  deleteStudent: (id) => ipcRenderer.invoke('db:deleteStudent', id),
  addAssessment: (payload) => ipcRenderer.invoke('db:addAssessment', payload),
  updateAssessment: (payload) => ipcRenderer.invoke('db:updateAssessment', payload),
  deleteAssessment: (payload) => ipcRenderer.invoke('db:deleteAssessment', payload),
  getMarksForAssessment: (payload) => ipcRenderer.invoke('db:getMarksForAssessment', payload),
  importPdf: (payload) => ipcRenderer.invoke('pdf:import', payload),
  saveMarks: (payload) => ipcRenderer.invoke('marks:save', payload),
  exportExcel: (opts) => ipcRenderer.invoke('excel:export', opts),
  copyToClipboard: (tsv) => ipcRenderer.invoke('clipboard:copy', tsv),
  bulkUpdateSection: (payload) => ipcRenderer.invoke('db:bulkUpdateSection', payload),
  clearAllData: () => ipcRenderer.invoke('db:clearAllData')
};

contextBridge.exposeInMainWorld('electronAPI', api);
contextBridge.exposeInMainWorld('api', api);
