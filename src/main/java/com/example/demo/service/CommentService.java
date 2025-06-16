package com.example.demo.service;

import com.example.demo.domain.Comment;
import com.example.demo.domain.Post;
import com.example.demo.domain.User;
import com.example.demo.repository.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository repository;


    public Comment save(Comment entity) {
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(entity);
    }

    public Iterable<Comment> saveAll(Iterable<Comment> entities) {
        entities.forEach(c -> {
            if (c.getCreatedAt() == null) c.setCreatedAt(LocalDateTime.now());
        });
        return repository.saveAll(entities);
    }

    public Optional<Comment> findById(Long id) {
        return repository.findById(id);
    }

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public Iterable<Comment> findAll() {
        return repository.findAll();
    }

    public Iterable<Comment> findAllById(Iterable<Long> ids) {
        return repository.findAllById(ids);
    }

    public long count() {
        return repository.count();
    }

    @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public void delete(Comment entity) {
        repository.delete(entity);
    }

    @Transactional
    public void deleteAllById(Iterable<? extends Long> ids) {
        repository.deleteAllById(ids);
    }

    @Transactional
    public void deleteAll(Iterable<? extends Comment> entities) {
        repository.deleteAll(entities);
    }

    @Transactional
    public void deleteAll() {
        repository.deleteAll();
    }



    public List<Comment> findByPost(Post post) {
        return repository.findByPost(post);
    }

    public List<Comment> findByAuthor(User author) {
        return repository.findByAuthor(author);
    }

    public List<Comment> findRecentByPost(Post post, int limit) {
        return repository.findByPost(post).stream()
                .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()))
                .limit(limit)
                .toList();
    }

    @Transactional
    public void upVote(Long commentId) {
        repository.findById(commentId).ifPresent(c -> {
            c.setUpVotes(c.getUpVotes() + 1);
            repository.save(c);
        });
    }

    @Transactional
    public void downVote(Long commentId) {
        repository.findById(commentId).ifPresent(c -> {
            c.setDownVotes(c.getDownVotes() + 1);
            repository.save(c);
        });
    }

    @Transactional
    public Optional<Comment> updateContent(Long id, String newContent) {
        Optional<Comment> optionalComment = repository.findById(id);
        optionalComment.ifPresent(comment -> {
            comment.setContent(newContent);
            repository.save(comment);
        });
        return optionalComment;
    }
}
