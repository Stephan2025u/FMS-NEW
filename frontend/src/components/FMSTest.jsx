import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { clientAPI, fmsExercisesAPI, testResultAPI } from "../services/api";
import ExerciseScoring from "./ExerciseScoring";
import { useToast } from "../hooks/use-toast";

const FMSTest = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState(null);
  const [fmsExercises, setFmsExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [testData, setTestData] = useState({
    scores: {},
    assessor_notes: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, [clientId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch client and FMS exercises in parallel
      const [clientData, exercisesData] = await Promise.all([
        clientAPI.getClient(clientId),
        fmsExercisesAPI.getExercises()
      ]);
      
      setClient(clientData);
      setFmsExercises(exercisesData);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load test data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load test data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateExerciseScore = (exerciseId, scoreData) => {
    setTestData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [exerciseId]: scoreData
      }
    }));
  };

  const handleNext = () => {
    const currentExerciseId = fmsExercises[currentExercise].id;
    const currentScore = testData.scores[currentExerciseId];
    
    if (!currentScore || currentScore.score === undefined) {
      toast({
        title: "Score Required",
        description: "Please score this exercise before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentExercise < fmsExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const calculateTotalScore = () => {
    return Object.values(testData.scores).reduce((total, score) => total + (score.score || 0), 0);
  };

  const handleCompleteTest = async () => {
    try {
      setSubmitting(true);
      
      // Prepare test data for API
      const testResultData = {
        client_id: client.id,
        scores: testData.scores,
        assessor_notes: testData.assessor_notes || null
      };

      // Create test result
      const testResult = await testResultAPI.createTestResult(testResultData);
      
      toast({
        title: "Test Completed",
        description: `FMS test completed with a total score of ${testResult.total_score}/21.`,
      });

      navigate(`/results/${testResult.id}`);
    } catch (error) {
      console.error('Error completing test:', error);
      toast({
        title: "Error",
        description: "Failed to save test results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isTestComplete = () => {
    return fmsExercises.every(exercise => 
      testData.scores[exercise.id] && testData.scores[exercise.id].score !== undefined
    );
  };

  const getExerciseStatus = (index) => {
    const exercise = fmsExercises[index];
    const score = testData.scores[exercise.id];
    
    if (score && score.score !== undefined) {
      return score.pain ? "pain" : "completed";
    }
    return index === currentExercise ? "current" : "pending";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading test data...</span>
        </div>
      </div>
    );
  }

  if (error || !client || !fmsExercises.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-8">
            <p className="text-red-500 mb-4">{error || "Failed to load test data"}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate("/")} variant="outline">
                Return to Dashboard
              </Button>
              <Button onClick={fetchInitialData} className="bg-blue-600 hover:bg-blue-700 text-white">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentExercise + 1) / fmsExercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
              FMS Test - {client.name}
            </h1>
            <p className="text-gray-600">
              Exercise {currentExercise + 1} of {fmsExercises.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">
                Test Progress
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            <div className="flex justify-between text-xs text-gray-500">
              {fmsExercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`flex items-center gap-1 ${
                    index === currentExercise ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {getExerciseStatus(index) === "completed" && (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  )}
                  {getExerciseStatus(index) === "pain" && (
                    <AlertCircle className="h-3 w-3 text-red-600" />
                  )}
                  <span className="hidden sm:inline">
                    {exercise.name.split(' ').slice(0, 2).join(' ')}
                  </span>
                  <span className="sm:hidden">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exercise Information */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">
                  {fmsExercises[currentExercise].name}
                </CardTitle>
                <CardDescription>
                  {fmsExercises[currentExercise].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                    <p className="text-sm text-gray-600">
                      {fmsExercises[currentExercise].instructions}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Scoring Criteria:</h4>
                    <div className="space-y-2">
                      {Object.entries(fmsExercises[currentExercise].scoring_criteria).map(([score, criteria]) => (
                        <div key={score} className="flex items-start gap-2">
                          <Badge
                            variant={score === "0" ? "destructive" : "secondary"}
                            className="mt-0.5 min-w-[24px] justify-center"
                          >
                            {score}
                          </Badge>
                          <p className="text-sm text-gray-600">{criteria}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scoring Section */}
          <div className="lg:col-span-2">
            <ExerciseScoring
              exercise={fmsExercises[currentExercise]}
              currentScore={testData.scores[fmsExercises[currentExercise].id]}
              onScoreUpdate={updateExerciseScore}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentExercise === 0}
            className="bg-white/50 border-gray-300 hover:bg-white/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Current Total: {calculateTotalScore()}/21
            </span>
          </div>

          {currentExercise < fmsExercises.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCompleteTest}
              disabled={!isTestComplete() || submitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Test
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FMSTest;