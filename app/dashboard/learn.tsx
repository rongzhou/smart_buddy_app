import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Colors from '../../constants/colors';

// 假设这些是从API获取的数据
const CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'math', name: '数学' },
  { id: 'physics', name: '物理' },
  { id: 'chemistry', name: '化学' },
  { id: 'biology', name: '生物' },
  { id: 'chinese', name: '语文' },
  { id: 'english', name: '英语' },
];

const LEARNING_ITEMS = [
  { 
    id: '1', 
    title: '三角函数基础知识汇总', 
    category: 'math', 
    difficulty: '中等', 
    accessCount: 120,
    tags: ['三角函数', '公式', '图形']
  },
  { 
    id: '2', 
    title: '牛顿运动定律完全解析', 
    category: 'physics', 
    difficulty: '较难', 
    accessCount: 85,
    tags: ['力学', '运动', '牛顿定律']
  },
  { 
    id: '3', 
    title: '有机化学反应机理详解', 
    category: 'chemistry', 
    difficulty: '较难', 
    accessCount: 72,
    tags: ['有机化学', '反应', '机理']
  },
  { 
    id: '4', 
    title: '英语时态用法详解', 
    category: 'english', 
    difficulty: '简单', 
    accessCount: 145,
    tags: ['语法', '时态', '用法']
  },
  { 
    id: '5', 
    title: '平面几何证明题技巧', 
    category: 'math', 
    difficulty: '中等', 
    accessCount: 98,
    tags: ['几何', '证明', '技巧']
  },
];

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');

  // 过滤学习内容
  const filteredContent = LEARNING_ITEMS.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = searchText === '' || 
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    
    return matchCategory && matchSearch;
  });

  const getCategoryName = (categoryId: string) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>学习内容</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索知识点、题目类型..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === item.id && styles.selectedCategoryItem
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.selectedCategoryText
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {filteredContent.length > 0 ? (
        <FlatList
          data={filteredContent}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.contentItem}>
              <View style={styles.contentHeader}>
                <Text style={styles.contentTitle}>{item.title}</Text>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badge}>{getCategoryName(item.category)}</Text>
                  <Text 
                    style={[
                      styles.difficultyBadge, 
                      item.difficulty === '简单' ? styles.easyBadge :
                      item.difficulty === '中等' ? styles.mediumBadge :
                      styles.hardBadge
                    ]}
                  >
                    {item.difficulty}
                  </Text>
                </View>
              </View>
              
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.contentFooter}>
                <Text style={styles.accessCount}>{item.accessCount} 人学习过</Text>
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>开始学习</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.contentList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>没有找到相关内容</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: '500',
  },
  contentList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  contentItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  badgeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    color: 'white',
    overflow: 'hidden',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accessCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  startButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  startButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
