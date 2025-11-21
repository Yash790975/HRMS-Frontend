import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('employee_tasks');
    const savedProjects = localStorage.getItem('employee_projects');

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const sampleTasks = [
        {
          id: '1',
          title: 'Implement user authentication',
          description: 'Create login and registration functionality',
          status: 'in-progress',
          priority: 'high',
          dueDate: '2024-01-20',
          project: 'Web Portal',
          assignedBy: 'Jane Smith',
          progress: 60,
          tags: ['frontend', 'security']
        },
        {
          id: '2',
          title: 'Database optimization',
          description: 'Optimize query performance for user dashboard',
          status: 'todo',
          priority: 'medium',
          dueDate: '2024-01-25',
          project: 'Performance Improvement',
          assignedBy: 'John Manager',
          progress: 0,
          tags: ['backend', 'database']
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem('employee_tasks', JSON.stringify(sampleTasks));
    }

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      const sampleProjects = [
        {
          id: '1',
          name: 'Web Portal',
          description: 'Customer-facing web portal development',
          status: 'active',
          progress: 45,
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          teamMembers: ['Krishna patel', 'Jane Smith', 'Bob Wilson'],
          tasks: 12,
          completedTasks: 5
        },
        {
          id: '2',
          name: 'Mobile App',
          description: 'iOS and Android mobile application',
          status: 'planning',
          progress: 10,
          startDate: '2024-02-01',
          endDate: '2024-06-30',
          teamMembers: ['Krishna Patel', 'Alice Johnson'],
          tasks: 8,
          completedTasks: 1
        }
      ];
      setProjects(sampleProjects);
      localStorage.setItem('employee_projects', JSON.stringify(sampleProjects));
    }
  }, []);

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('employee_tasks', JSON.stringify(updatedTasks));
  };

  const updateTaskProgress = (taskId, progress) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, progress } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('employee_tasks', JSON.stringify(updatedTasks));
  };

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      progress: 0,
      status: 'todo'
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem('employee_tasks', JSON.stringify(updatedTasks));
    return newTask;
  };

  const value = {
    tasks,
    projects,
    updateTaskStatus,
    updateTaskProgress,
    addTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};