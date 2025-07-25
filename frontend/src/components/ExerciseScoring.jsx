import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { AlertTriangle } from "lucide-react";

const ExerciseScoring = ({ exercise, currentScore, onScoreUpdate }) => {
  const [score, setScore] = useState(currentScore?.score || null);
  const [pain, setPain] = useState(currentScore?.pain || false);
  const [notes, setNotes] = useState(currentScore?.notes || "");

  const handleScoreChange = (newScore) => {
    setScore(newScore);
    onScoreUpdate(exercise.id, {
      score: newScore,
      pain: pain,
      notes: notes
    });
  };

  const handlePainChange = (newPain) => {
    setPain(newPain);
    if (newPain) {
      setScore(0);
      onScoreUpdate(exercise.id, {
        score: 0,
        pain: newPain,
        notes: notes
      });
    } else {
      onScoreUpdate(exercise.id, {
        score: score,
        pain: newPain,
        notes: notes
      });
    }
  };

  const handleNotesChange = (newNotes) => {
    setNotes(newNotes);
    onScoreUpdate(exercise.id, {
      score: score,
      pain: pain,
      notes: newNotes
    });
  };

  const getScoreColor = (scoreValue) => {
    if (scoreValue === 0) return "bg-red-100 text-red-800 border-red-200";
    if (scoreValue === 1) return "bg-orange-100 text-orange-800 border-orange-200";
    if (scoreValue === 2) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (scoreValue === 3) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Score Assessment</CardTitle>
        <CardDescription>
          Select the appropriate score based on the client's performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pain Indicator */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <Label className="text-sm font-medium text-red-800">
                  Pain During Movement
                </Label>
                <p className="text-xs text-red-600 mt-1">
                  If pain is present, score automatically becomes 0
                </p>
              </div>
            </div>
            <Switch
              checked={pain}
              onCheckedChange={handlePainChange}
              className="data-[state=checked]:bg-red-600"
            />
          </div>
        </div>

        {/* Score Selection */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Select Score (0-3)
          </Label>
          <div className="grid grid-cols-1 gap-3">
            {[3, 2, 1, 0].map((scoreValue) => (
              <button
                key={scoreValue}
                onClick={() => handleScoreChange(scoreValue)}
                disabled={pain && scoreValue !== 0}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  score === scoreValue
                    ? getScoreColor(scoreValue) + " border-current"
                    : "bg-white/50 border-gray-200 hover:border-gray-300"
                } ${pain && scoreValue !== 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-start gap-3">
                  <Badge
                    variant={scoreValue === 0 ? "destructive" : "secondary"}
                    className="mt-0.5 min-w-[24px] justify-center"
                  >
                    {scoreValue}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {scoreValue === 0 && "Pain or Unable to Perform"}
                      {scoreValue === 1 && "Significant Compensation"}
                      {scoreValue === 2 && "Acceptable with Modifications"}
                      {scoreValue === 3 && "Optimal Performance"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {exercise.scoringCriteria[scoreValue]}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Score Display */}
        {score !== null && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Current Score</p>
                <p className="text-xs text-blue-600">
                  {pain ? "Pain reported during movement" : "Score based on performance"}
                </p>
              </div>
              <Badge className={`${getScoreColor(score)} text-lg px-3 py-1`}>
                {score}/3
              </Badge>
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Assessment Notes
          </Label>
          <Textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Enter any observations, compensations, or additional notes about the client's performance..."
            className="bg-white/70 border-gray-300 min-h-[100px] resize-none"
          />
          <p className="text-xs text-gray-500">
            Document any compensations, limitations, or observations
          </p>
        </div>

        {/* Assessment Summary */}
        {score !== null && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Assessment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Exercise:</span>
                <span className="font-medium">{exercise.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Score:</span>
                <span className="font-medium">{score}/3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pain:</span>
                <span className="font-medium">{pain ? "Yes" : "No"}</span>
              </div>
              {notes && (
                <div className="pt-2 border-t">
                  <span className="text-gray-600">Notes:</span>
                  <p className="text-gray-800 mt-1">{notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseScoring;