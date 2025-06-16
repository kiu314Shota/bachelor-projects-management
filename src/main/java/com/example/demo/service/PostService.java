package com.example.demo.service;

import com.example.demo.domain.Hub;
import com.example.demo.domain.Post;
import com.example.demo.domain.User;
import com.example.demo.repository.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository repository;


    public Post save(Post entity) {
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(entity);
    }

    public Iterable<Post> saveAll(Iterable<Post> entities) {
        entities.forEach(p -> {
            if (p.getCreatedAt() == null) p.setCreatedAt(LocalDateTime.now());
        });
        return repository.saveAll(entities);
    }

    public Optional<Post> findById(Long id) {
        return repository.findById(id);
    }

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public Iterable<Post> findAll() {
        return repository.findAll();
    }

    public Iterable<Post> findAllById(Iterable<Long> ids) {
        return repository.findAllById(ids);
    }

    public List<Post> findAllByAuthor(User author) {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .filter(p -> p.getAuthor().equals(author))
                .toList();
    }
    public List<Post> findByHub(Hub hub) {
        return repository.findByHub(hub);
    }

    public List<Post> findAllByHub(Hub hub) {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .filter(p -> p.getHub().equals(hub))
                .toList();
    }
    public List<Post> findByAuthor(User author) {
        return repository.findByAuthor(author);
    }

    public long count() {
        return repository.count();
    }

    @Transactional
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public void delete(Post post) {
        repository.delete(post);
    }

    @Transactional
    public void deleteAllById(Iterable<? extends Long> ids) {
        repository.deleteAllById(ids);
    }

    @Transactional
    public void deleteAll(Iterable<? extends Post> posts) {
        repository.deleteAll(posts);
    }

    @Transactional
    public void deleteAll() {
        repository.deleteAll();
    }

    @Transactional
    public Optional<Post> updatePostText(Long id, String newText) {
        Optional<Post> optionalPost = repository.findById(id);
        optionalPost.ifPresent(post -> {
            post.setText(newText);
            repository.save(post);
        });
        return optionalPost;
    }
    @Transactional
    public void addUpvote(Long postId) {
        repository.findById(postId).ifPresent(post -> {
            post.setUpVotes(post.getUpVotes() + 1);
            repository.save(post);
        });
    }

    @Transactional
    public void addDownVote(Long postId) {
        repository.findById(postId).ifPresent(post -> {
            post.setDownVotes(post.getDownVotes() + 1);
            repository.save(post);
        });
    }

    public List<Post> findRecentPosts(int limit) {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .limit(limit)
                .toList();
    }

    public List<Post> findTopPostsByUpVotes(int limit) {
        return repository.findTopByOrderByUpVotesDesc().stream()
                .limit(limit)
                .toList();
    }


}
