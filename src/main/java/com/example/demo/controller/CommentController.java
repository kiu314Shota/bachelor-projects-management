package com.example.demo.controller;


import com.example.demo.domain.Comment;
import com.example.demo.domain.Hub;
import com.example.demo.domain.Post;
import com.example.demo.domain.User;
import com.example.demo.dto.CommentRequestDto;
import com.example.demo.dto.CommentResponseDto;
import com.example.demo.repository.HubRepository;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CommentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
@SecurityRequirement(name = "bearerAuth")
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final HubRepository hubRepository;
    private final ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<CommentResponseDto> create(@RequestBody CommentRequestDto dto) {
        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Hub hub = hubRepository.findById(dto.getHubId())
                .orElseThrow(() -> new RuntimeException("Hub not found"));

        // ჰაბი უნდა ემთხვეოდეს პოსტზე მითითებულ ჰაბს
        if (!post.getHub().getId().equals(hub.getId())) {
            return ResponseEntity.badRequest().body(null); // ან სხვა exception
        }

        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setCreatedAt(LocalDateTime.now());

        Comment saved = commentService.save(comment);
        return ResponseEntity.ok(toDto(saved));
    }

    @GetMapping
    public List<CommentResponseDto> getAll() {
        return StreamSupport.stream(commentService.findAll().spliterator(), false)
                .map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponseDto> getById(@PathVariable Long id) {
        return commentService.findById(id)
                .map(comment -> ResponseEntity.ok(toDto(comment)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/post/{postId}")
    public List<CommentResponseDto> getByPost(@PathVariable Long postId) {
        Post post = postRepository.findById(postId).orElseThrow();
        return commentService.findByPost(post).stream().map(this::toDto).toList();
    }

    @GetMapping("/post/{postId}/recent")
    public List<CommentResponseDto> getRecentByPost(@PathVariable Long postId, @RequestParam(defaultValue = "10") int limit) {
        Post post = postRepository.findById(postId).orElseThrow();
        return commentService.findRecentByPost(post, limit).stream().map(this::toDto).toList();
    }

    @GetMapping("/author/{authorId}")
    public List<CommentResponseDto> getByAuthor(@PathVariable Long authorId) {
        User author = userRepository.findById(authorId).orElseThrow();
        return commentService.findByAuthor(author).stream().map(this::toDto).toList();
    }

    @PutMapping("/{id}/content")
    public ResponseEntity<CommentResponseDto> updateContent(@PathVariable Long id, @RequestParam String content) {
        return commentService.updateContent(id, content)
                .map(comment -> ResponseEntity.ok(toDto(comment)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/upvote")
    public ResponseEntity<Void> upvote(@PathVariable Long id) {
        if (!commentService.existsById(id)) return ResponseEntity.notFound().build();
        commentService.upVote(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/downvote")
    public ResponseEntity<Void> downvote(@PathVariable Long id) {
        if (!commentService.existsById(id)) return ResponseEntity.notFound().build();
        commentService.downVote(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!commentService.existsById(id)) return ResponseEntity.notFound().build();
        commentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Comment toEntity(CommentRequestDto dto) {
        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setAuthor(userRepository.findById(dto.getAuthorId()).orElseThrow());
        comment.setPost(postRepository.findById(dto.getPostId()).orElseThrow());
        return comment;
    }

    private CommentResponseDto toDto(Comment comment) {
        CommentResponseDto dto = modelMapper.map(comment, CommentResponseDto.class);
        dto.setPostId(comment.getPost().getId());
        dto.setAuthorId(comment.getAuthor().getId());
        return dto;
    }
}
