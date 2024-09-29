"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Activity, Heart, Brain, Zap, Dumbbell, Utensils, Moon, Droplet } from 'lucide-react'

export default function EnhancedHealthReport() {
  const healthScore = 85
  const name = "Emily Johnson"
  const age = 28

  const healthScores = [
    { month: 'Jan', score: 78 },
    { month: 'Feb', score: 80 },
    { month: 'Mar', score: 79 },
    { month: 'Apr', score: 82 },
    { month: 'May', score: 84 },
    { month: 'Jun', score: 85 },
  ]

  const bloodTestData = [
    { name: 'RBC', value: 4.8, min: 4.2, max: 5.4 },
    { name: 'WBC', value: 7.5, min: 4.5, max: 11.0 },
    { name: 'PLT', value: 250, min: 150, max: 450 },
    { name: 'HGB', value: 14.2, min: 12.0, max: 15.5 },
    { name: 'HCT', value: 42, min: 37, max: 47 },
  ]

  const wellnessScores = [
    { category: 'Nutrition', score: 80 },
    { category: 'Exercise', score: 75 },
    { category: 'Sleep', score: 85 },
    { category: 'Stress', score: 70 },
    { category: 'Hydration', score: 90 },
  ]

  const healthInsights = [
    { icon: Heart, title: "Cardiovascular", score: 88 },
    { icon: Brain, title: "Cognitive", score: 92 },
    { icon: Zap, title: "Energy", score: 85 },
    { icon: Dumbbell, title: "Fitness", score: 78 },
  ]

  const actionPlans = [
    { title: "Increase daily steps", description: "Aim for 10,000 steps per day to improve cardiovascular health." },
    { title: "Optimize sleep routine", description: "Establish a consistent sleep schedule to enhance cognitive function." },
    { title: "Boost iron intake", description: "Include more iron-rich foods in your diet to increase energy levels." },
    { title: "Strength training", description: "Add resistance exercises twice a week to improve overall fitness." },
  ]

  const colorPalette = {
    primary: "#4F46E5",
    secondary: "#10B981",
    tertiary: "#F59E0B",
    quaternary: "#EF4444",
    background: "#F3F4F6",
    text: "#1F2937",
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">{name}</CardTitle>
              <p className="text-xl">Age: {age}</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold">{healthScore}</p>
              <p className="text-xl">Health Score</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Score Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={healthScores}>
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke={colorPalette.primary} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blood Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={bloodTestData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={colorPalette.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={wellnessScores}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Wellness" dataKey="score" stroke={colorPalette.secondary} fill={colorPalette.secondary} fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {healthInsights.map((insight, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <insight.icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{insight.title}</p>
                        <Progress value={insight.score} className="w-full h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actionPlans.map((plan, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{plan.title}</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors">
              Schedule Follow-up Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}