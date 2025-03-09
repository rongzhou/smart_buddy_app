import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import Colors from '../../constants/colors';

export default function DashboardScreen() {
  // 假设这些数据是从API获取的
  const recentQuestions = [
    { id: '1', title: '三角函数的基本公式推导', subject: '数学', date: '今天' },
    { id: '2', title: '牛顿第二定律的应用', subject: '物理', date: '昨天' },
  ];

  const recommendedExercises = [
    { id: '1', title: '相似三角形的性质及应用', subject: '数学', level: '中等' },
    { id: '2', title: '电流与电压的关系', subject: '物理', level: '简单' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>你好, 同学</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
              <Text style={styles.actionIconText}>📷</Text>
            </View>
            <Text style={styles.actionText}>拍照识题</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.secondary }]}>
              <Text style={styles.actionIconText}>📊</Text>
            </View>
            <Text style={styles.actionText}>学习报告</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.warning }]}>
              <Text style={styles.actionIconText}>📚</Text>
            </View>
            <Text style={styles.actionText}>学习内容</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.info }]}>
              <Text style={styles.actionIconText}>👤</Text>
            </View>
            <Text style={styles.actionText}>个人中心</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>最近解析题目</Text>
          {recentQuestions.length > 0 ? (
            recentQuestions.map(question => (
              <TouchableOpacity key={question.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{question.title}</Text>
                  <Text style={styles.cardBadge}>{question.subject}</Text>
                </View>
                <Text style={styles.cardDate}>{question.date}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>还没有解析过题目</Text>
              <TouchableOpacity style={styles.emptyStateButton}>
                <Text style={styles.emptyStateButtonText}>立即拍照识题</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>推荐练习</Text>
          {recommendedExercises.map(exercise => (
            <TouchableOpacity key={exercise.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{exercise.title}</Text>
                <Text style={styles.cardBadge}>{exercise.subject}</Text>
              </View>
              <View style={styles.exerciseFooter}>
                <Text style={styles.exerciseLevel}>难度: {exercise.level}</Text>
                <TouchableOpacity style={styles.exerciseButton}>
                  <Text style={styles.exerciseButtonText}>开始</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  date: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionButton: {
    alignItems: 'center',
    width: '23%',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  cardBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    color: 'white',
    overflow: 'hidden',
    marginLeft: 8,
  },
  cardDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  exerciseLevel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  exerciseButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exerciseButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});