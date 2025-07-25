import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle } from "lucide-react";
import { mockClients, mockTestResults, fmsExercises } from "../data/mockData";

const TestResults = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [testResult, setTestResult] = useState(() => {
    // First check localStorage for new test results
    const savedResult = localStorage.getItem(`test-${testId}`);
    if (savedResult) {
      return JSON.parse(savedResult);
    }
    // Fall back to mock data
    return mockTestResults.find(test => test.id === testId);
  });
  const [client] = useState(mockClients.find(c => c.id === testResult?.clientId));

  if (!testResult || !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Test results not found</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 17) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 14) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getScoreInterpretation = (score) => {
    if (score >= 17) return { level: "Good", description: "Low risk of injury, good movement quality" };
    if (score >= 14) return { level: "Moderate", description: "Moderate risk, some movement limitations" };
    return { level: "Needs Attention", description: "Higher risk of injury, significant movement limitations" };
  };

  const getExerciseScoreColor = (score) => {
    if (score === 0) return "bg-red-100 text-red-800";
    if (score === 1) return "bg-orange-100 text-orange-800";
    if (score === 2) return "bg-yellow-100 text-yellow-800";
    if (score === 3) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const interpretation = getScoreInterpretation(testResult.totalScore);
  const painIndicators = Object.values(testResult.scores).filter(score => score.pain).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/client/${client.id}`)}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                FMS Test Results
              </h1>
              <p className="text-gray-600">
                {client.name} • {formatDate(testResult.testDate)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/50 border-gray-300 hover:bg-white/80">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className="bg-white/50 border-gray-300 hover:bg-white/80">
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Total Score</CardTitle>
              <div className={`text-6xl font-bold p-4 rounded-lg ${getScoreColor(testResult.totalScore)}`}>
                {testResult.totalScore}
                <span className="text-2xl">/21</span>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <Badge className={`${getScoreColor(testResult.totalScore)} text-sm px-3 py-1`}>
                {interpretation.level}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                {interpretation.description}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Pain Indicators</CardTitle>
              <div className="text-6xl font-bold p-4 rounded-lg bg-red-100 text-red-800">
                {painIndicators}
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-2">
                {painIndicators > 0 ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Pain reported</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">No pain reported</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Average Score</CardTitle>
              <div className="text-6xl font-bold p-4 rounded-lg bg-blue-100 text-blue-800">
                {(testResult.totalScore / 7).toFixed(1)}
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                Per exercise average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Exercise Breakdown</CardTitle>
            <CardDescription>
              Individual scores for each FMS exercise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fmsExercises.map((exercise) => {
                const exerciseScore = testResult.scores[exercise.id];
                if (!exerciseScore) return null;

                return (
                  <div key={exercise.id} className="border border-gray-200 rounded-lg p-4 bg-white/50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {exerciseScore.pain && (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <Badge className={`${getExerciseScoreColor(exerciseScore.score)} text-lg px-3 py-1`}>
                          {exerciseScore.score}/3
                        </Badge>
                      </div>
                    </div>
                    
                    {exerciseScore.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Notes:</strong> {exerciseScore.notes}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-3 text-xs text-gray-500">
                      <strong>Scoring Criteria:</strong> {exercise.scoringCriteria[exerciseScore.score]}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Assessor Notes */}
        {testResult.assessorNotes && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Assessor Notes</CardTitle>
              <CardDescription>
                Additional observations and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">{testResult.assessorNotes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={() => navigate(`/test/${client.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            New Test
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/client/${client.id}`)}
            className="bg-white/50 border-gray-300 hover:bg-white/80"
          >
            View Client Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;