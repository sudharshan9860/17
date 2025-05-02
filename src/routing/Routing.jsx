// src/routing/Routing.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import StudentDash from '../components/StudentDash';
import SolveQuestion from '../components/SolveQuestion';
import ResultPage from '../components/ResultPage';
import SignupPage from '../components/SignupPage';
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../components/Layout';
import QuestionListModal from '../components/QuestionListModal';
import Analytics from '../components/Analytics';
import SimilarQuestions from '../components/SimilarQuestions';
import LeaderboardPage from '../components/LeaderBoardPage';
import ProgressDashboard from '../components/ProgressDashboard';
import QuestsPage from '../components/QuestsPage';
import TeacherDash from '../components/TeacherDash';      
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      <Route
        path="/student-dash"
        element={
          <PrivateRoute>
            <Layout>
              <StudentDash />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route        
        path="/teacher-dash"
        element={
          <PrivateRoute>
            <Layout>
              <TeacherDash />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/solvequestion"
        element={
          <PrivateRoute>
            <Layout>
              <SolveQuestion />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/progress-dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <ProgressDashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/questionlistmodal"
        element={
          <PrivateRoute>
            <Layout>
              <QuestionListModal />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/resultpage"
        element={
          <PrivateRoute>
            <Layout>
              <ResultPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/similar-questions"
        element={
          <PrivateRoute>
            <Layout>
              <SimilarQuestions />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <Layout>
              <Analytics />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <PrivateRoute>
            <Layout>
              <LeaderboardPage />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* Add the new Quests route */}
      <Route
        path="/quests"
        element={
          <PrivateRoute>
            <Layout>
              <QuestsPage />
            </Layout>
          </PrivateRoute>
        }
      />
      
      {/* Fallback route for undefined paths */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;