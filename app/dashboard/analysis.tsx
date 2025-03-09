import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import Colors from '../../constants/colors';

export default function AnalysisScreen() {
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // 在实际应用中，应该从路由参数中获取任务ID
  // const { taskId } = useLocalSearchParams();

  // 模拟获取OCR识别结果
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // 模拟OCR识别结果
      setResult({
        ocrResult: "已知：向量a=(2,3,-1)，向量b=(1,-2,4)，向量c=(3,0,2)。\n求：(a·b)c - (a×b)",
        ocrConfidence: 0.95,
        type: "数学",
        imageUrl: null, // 实际应用中应该是原始图片的URL
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 模拟分析题目
  const handleAnalyze = () => {
    setAnalyzing(true);
    // 模拟分析过程
    setTimeout(() => {
      setAnalyzing(false);
      // 更新结果，加入解析内容
      setResult(prev => ({
        ...prev,
        analysis: {
          steps: [
            {
              title: "第一步：计算向量点积(a·b)",
              content: "a·b = 2×1 + 3×(-2) + (-1)×4 = 2 - 6 - 4 = -8"
            },
            {
              title: "第二步：计算(a·b)c",
              content: "(a·b)c = -8c = -8(3, 0, 2) = (-24, 0, -16)"
            },
            {
              title: "第三步：计算向量叉积(a×b)",
              content: "a×b = (3×4-(-1)×(-2), (-1)×1-2×4, 2×(-2)-3×1)\n= (12-2, -1-8, -4-3)\n= (10, -9, -7)"
            },
            {
              title: "第四步：计算最终结果",
              content: "(a·b)c - (a×b) = (-24, 0, -16) - (10, -9, -7)\n= (-34, 9, -9)"
            }
          ],
          difficulty: "中等",
          knowledgePoints: ["向量点积", "向量叉积", "向量运算"],
          relatedTopics: ["三维空间中的向量运算", "向量代数基础"]
        }
      }));
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ 
        headerShown: true,
        title: '题目解析',
        headerBackTitle: '返回',
      }} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>正在识别题目...</Text>
          </View>
        ) : (
          <>
            <View style={styles.imageContainer}>
              {result?.imageUrl ? (
                <Image source={{ uri: result.imageUrl }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>题目图片</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>识别结果</Text>
              <View style={styles.card}>
                <Text style={styles.ocrText}>{result?.ocrResult}</Text>
                <View style={styles.typeContainer}>
                  <Text style={styles.confidenceText}>识别准确率: {Math.round(result?.ocrConfidence * 100)}%</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{result?.type}</Text>
                  </View>
                </View>
              </View>
            </View>

            {!result?.analysis && !analyzing && (
              <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
                <Text style={styles.analyzeButtonText}>解析题目</Text>
              </TouchableOpacity>
            )}

            {analyzing && (
              <View style={styles.analyzeLoadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.analyzeLoadingText}>正在分析题目...</Text>
              </View>
            )}

            {result?.analysis && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>题目解析</Text>
                  <View style={styles.card}>
                    <View style={styles.difficultyContainer}>
                      <Text style={styles.difficultyLabel}>难度：</Text>
                      <Text 
                        style={[
                          styles.difficultyBadge,
                          result.analysis.difficulty === '简单' ? styles.easyBadge :
                          result.analysis.difficulty === '中等' ? styles.mediumBadge :
                          styles.hardBadge
                        ]}
                      >
                        {result.analysis.difficulty}
                      </Text>
                    </View>

                    {result.analysis.steps.map((step, index) => (
                      <View key={index} style={styles.step}>
                        <Text style={styles.stepTitle}>{step.title}</Text>
                        <Text style={styles.stepContent}>{step.content}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>知识点</Text>
                  <View style={styles.card}>
                    <View style={styles.tagContainer}>
                      {result.analysis.knowledgePoints.map((point, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{point}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>相关主题</Text>
                  <View style={styles.card}>
                    <View style={styles.relatedTopicsContainer}>
                      {result.analysis.relatedTopics.map((topic, index) => (
                        <TouchableOpacity key={index} style={styles.relatedTopic}>
                          <Text style={styles.relatedTopicText}>{topic}</Text>
                          <Text style={styles.relatedTopicIcon}>›</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                    <Text style={styles.primaryButtonText}>查看类似题目</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                    <Text style={styles.secondaryButtonText}>收藏</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <View style={styles.bottomSpacer} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  imageContainer: {
    aspectRatio: 4/3,
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ocrText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
  },
  analyzeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  analyzeLoadingText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  difficultyLabel: {
    fontSize: 14,
    color: Colors.text,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    color: 'white',
    overflow: 'hidden',
  },
  easyBadge: {
    backgroundColor: Colors.success,
  },
  mediumBadge: {
    backgroundColor: Colors.warning,
  },
  hardBadge: {
    backgroundColor: Colors.error,
  },
  step: {
    marginBottom: 16,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    paddingLeft: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  stepContent: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  relatedTopicsContainer: {
    gap: 8,
  },
  relatedTopic: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  relatedTopicText: {
    fontSize: 14,
    color: Colors.text,
  },
  relatedTopicIcon: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 8,
    padding: 16,
    flex: 1,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
});
