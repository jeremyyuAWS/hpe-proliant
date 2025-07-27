import React from 'react';
import { TrendingUp, Clock, FileText, Eye, Activity, Zap, BarChart } from 'lucide-react';

interface ActivityPanelProps {
  activityData: {
    isProcessing: boolean;
    currentAction: string;
    relatedTopics: string[];
    sourceCount: number;
    processingTime: number;
  };
  messageCount: number;
}

export function ActivityPanel({ activityData, messageCount }: ActivityPanelProps) {
  return (
    <div className="h-full bg-gray-100 border-l border-gray-200 p-3 overflow-y-auto">
      <div className="space-y-4">
        {/* Processing Status */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-[#01A982]" />
            <span className="text-xs font-semibold text-gray-700">Status</span>
          </div>
          <div className="space-y-1">
            <div className={`w-2 h-2 rounded-full ${
              activityData.isProcessing ? 'bg-[#FF8300] animate-pulse' : 'bg-[#01A982]'
            }`}></div>
            <p className="text-xs text-gray-600">
              {activityData.isProcessing ? 'Analyzing...' : 'Ready'}
            </p>
          </div>
        </div>

        {/* Conversation Stats */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-semibold text-gray-700">Stats</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Messages:</span>
              <span className="font-medium">{messageCount}</span>
            </div>
            {activityData.sourceCount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Sources:</span>
                <span className="font-medium">{activityData.sourceCount} servers</span>
              </div>
            )}
            {activityData.processingTime > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Response:</span>
                <span className="font-medium">{(activityData.processingTime / 1000).toFixed(1)}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Related Topics */}
        {activityData.relatedTopics.length > 0 && (
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-semibold text-gray-700">Related</span>
            </div>
            <div className="space-y-1">
              {activityData.relatedTopics.slice(0, 4).map((topic, index) => (
                <button
                  key={index}
                  className="block w-full text-left text-xs text-gray-600 hover:text-[#01A982] hover:bg-gray-50 p-1 rounded transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-[#FF8300]" />
            <span className="text-xs font-semibold text-gray-700">Actions</span>
          </div>
          <div className="space-y-1">
            <button className="block w-full text-left text-xs text-gray-600 hover:text-[#01A982] hover:bg-gray-50 p-1 rounded transition-colors">
              <FileText className="h-3 w-3 inline mr-1" />
              Export
            </button>
            <button className="block w-full text-left text-xs text-gray-600 hover:text-[#01A982] hover:bg-gray-50 p-1 rounded transition-colors">
              <Eye className="h-3 w-3 inline mr-1" />
              Share
            </button>
            <button className="block w-full text-left text-xs text-gray-600 hover:text-[#01A982] hover:bg-gray-50 p-1 rounded transition-colors">
              <Clock className="h-3 w-3 inline mr-1" />
              History
            </button>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-br from-[#01A982]/5 to-blue-50 rounded-lg p-3 border border-[#01A982]/20">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-[#01A982] rounded-full"></div>
            <span className="text-xs font-semibold text-[#01A982]">Insight</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            {messageCount === 0 ? 'Start a conversation to see AI insights' :
             messageCount < 3 ? 'Building context from your questions...' :
             'Based on your requirements, I recommend exploring our DL380 Gen11 series for optimal performance.'}
          </p>
        </div>
      </div>
    </div>
  );
}