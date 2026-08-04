import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/ui/GlassCard';
import { Colors, Spacing, BorderRadius } from '@/theme';
import { triggerHaptic, normalizeFont } from '@/utils';

interface Task {
  id: string;
  title: string;
  dueTime: string;
  priority: 'HIGH' | 'MEDIUM' | 'NORMAL';
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Confirm Friday showing with Alexander Wright', dueTime: '10:00 AM', priority: 'HIGH', completed: false },
  { id: '2', title: 'Prepare CMA Home Valuation for 22 Bridle Path', dueTime: '1:30 PM', priority: 'HIGH', completed: false },
  { id: '3', title: 'Send WhatsApp pitch for 188 Yorkville Ave PH1', dueTime: '3:00 PM', priority: 'MEDIUM', completed: true },
  { id: '4', title: 'Follow up with Sophia Vance on mortgage approval', dueTime: '5:00 PM', priority: 'NORMAL', completed: false },
];

export function TodayTasksSection() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    triggerHaptic.light();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(280)} style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>TODAY'S REALTOR TASKS</Text>
        <Text style={styles.countText}>{completedCount}/{tasks.length} Done</Text>
      </View>

      <GlassCard style={styles.card}>
        {tasks.map((task, idx) => (
          <View key={task.id}>
            <TouchableOpacity
              style={styles.taskRow}
              onPress={() => toggleTask(task.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.checkbox, task.completed && styles.checkboxActive]}>
                {task.completed && <Text style={styles.checkIcon}>✓</Text>}
              </View>

              <View style={styles.taskContent}>
                <Text
                  style={[styles.taskTitle, task.completed && styles.taskCompleted]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>
                <Text style={styles.taskMeta}>
                  Due {task.dueTime} • <Text style={task.priority === 'HIGH' ? styles.pHigh : styles.pMed}>{task.priority}</Text>
                </Text>
              </View>
            </TouchableOpacity>
            {idx < tasks.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: normalizeFont(11),
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  countText: {
    fontSize: normalizeFont(11),
    color: Colors.textGold,
    fontWeight: '700',
  },
  card: {
    width: '100%',
    padding: 14,
    borderRadius: BorderRadius.md,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.borderActive,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkIcon: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: '900',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: normalizeFont(12),
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  taskMeta: {
    fontSize: normalizeFont(10),
    color: Colors.textMuted,
    marginTop: 2,
  },
  pHigh: {
    color: Colors.danger,
    fontWeight: '700',
  },
  pMed: {
    color: Colors.warning,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderGlass,
    marginVertical: 4,
  },
});

export default TodayTasksSection;
